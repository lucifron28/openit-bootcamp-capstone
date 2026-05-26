using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SideKick.Server.Data;
using SideKick.Server.Models;
using SideKick.Server.Services;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
}

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddScoped<IMeService, MeService>();
builder.Services.AddScoped<ISocialLinkService, SocialLinkService>();
builder.Services.AddScoped<ISkillsService, SkillsService>();
builder.Services.AddScoped<IGigPostsService, GigPostsService>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<AppDbContext>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok("OK"));

app.MapIdentityApi<AppUser>();

const string refreshTokenCookieName = "sidekick_refresh_token";
var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

app.MapPost("/token/login", async (
    HttpContext httpContext,
    LoginRequest login,
    IHttpClientFactory httpClientFactory) =>
{
    var httpClient = httpClientFactory.CreateClient();
    var identityResponse = await httpClient.PostAsJsonAsync(
        $"{httpContext.Request.Scheme}://{httpContext.Request.Host}/login",
        login);

    var responseBody = await identityResponse.Content.ReadAsStringAsync();
    if (!identityResponse.IsSuccessStatusCode)
    {
        return Results.Content(
            responseBody,
            identityResponse.Content.Headers.ContentType?.ToString(),
            statusCode: (int)identityResponse.StatusCode);
    }

    var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseBody, jsonOptions);
    if (tokenResponse is null || string.IsNullOrWhiteSpace(tokenResponse.AccessToken))
    {
        return Results.Problem("Identity did not return an access token.");
    }

    SetRefreshTokenCookie(httpContext, refreshTokenCookieName, tokenResponse.RefreshToken);

    return Results.Ok(new AccessTokenResponse(
        tokenResponse.TokenType,
        tokenResponse.AccessToken,
        tokenResponse.ExpiresIn));
});

app.MapPost("/token/refresh", async (
    HttpContext httpContext,
    IHttpClientFactory httpClientFactory) =>
{
    if (!httpContext.Request.Cookies.TryGetValue(refreshTokenCookieName, out var refreshToken) ||
        string.IsNullOrWhiteSpace(refreshToken))
    {
        return Results.Unauthorized();
    }

    var httpClient = httpClientFactory.CreateClient();
    var identityResponse = await httpClient.PostAsJsonAsync(
        $"{httpContext.Request.Scheme}://{httpContext.Request.Host}/refresh",
        new RefreshRequest(refreshToken));

    var responseBody = await identityResponse.Content.ReadAsStringAsync();
    if (!identityResponse.IsSuccessStatusCode)
    {
        httpContext.Response.Cookies.Delete(refreshTokenCookieName);
        return Results.Content(
            responseBody,
            identityResponse.Content.Headers.ContentType?.ToString(),
            statusCode: (int)identityResponse.StatusCode);
    }

    var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseBody, jsonOptions);
    if (tokenResponse is null || string.IsNullOrWhiteSpace(tokenResponse.AccessToken))
    {
        return Results.Problem("Identity did not return an access token.");
    }

    SetRefreshTokenCookie(httpContext, refreshTokenCookieName, tokenResponse.RefreshToken);

    return Results.Ok(new AccessTokenResponse(
        tokenResponse.TokenType,
        tokenResponse.AccessToken,
        tokenResponse.ExpiresIn));
});

app.MapPost("/token/logout", (HttpContext httpContext) =>
{
    httpContext.Response.Cookies.Delete(refreshTokenCookieName);
    return Results.Ok();
});

app.MapPost("/logout", async (SignInManager<AppUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
}).RequireAuthorization();

app.MapControllers();

app.Run();

static void SetRefreshTokenCookie(
    HttpContext httpContext,
    string cookieName,
    string refreshToken)
{
    httpContext.Response.Cookies.Append(
        cookieName,
        refreshToken,
        new CookieOptions
        {
            HttpOnly = true,
            Secure = !httpContext.RequestServices
                .GetRequiredService<IHostEnvironment>()
                .IsDevelopment(),
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(14),
            Path = "/",
        });
}

public sealed record LoginRequest(string Email, string Password);

public sealed record RefreshRequest(string RefreshToken);

public sealed record TokenResponse(
    string TokenType,
    string AccessToken,
    int ExpiresIn,
    string RefreshToken);

public sealed record AccessTokenResponse(
    string TokenType,
    string AccessToken,
    int ExpiresIn);
