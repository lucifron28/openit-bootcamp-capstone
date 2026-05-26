using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SideKick.Server.Data;
using SideKick.Server.Models;
using SideKick.Server.Services;
using System.ComponentModel.DataAnnotations;
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
builder.Services.AddScoped<IGigApplicationsService, GigApplicationsService>();

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

app.MapPost("/token/register", async (
    AppRegisterRequest register,
    UserManager<AppUser> userManager) =>
{
    var firstName = register.FirstName?.Trim() ?? string.Empty;
    var lastName = register.LastName?.Trim() ?? string.Empty;
    var email = register.Email?.Trim() ?? string.Empty;
    var validationErrors = new Dictionary<string, string[]>();

    if (string.IsNullOrWhiteSpace(firstName))
    {
        validationErrors["firstName"] = ["First name is required."];
    }
    else if (firstName.Length > 100)
    {
        validationErrors["firstName"] = ["First name is too long."];
    }

    if (string.IsNullOrWhiteSpace(lastName))
    {
        validationErrors["lastName"] = ["Last name is required."];
    }
    else if (lastName.Length > 100)
    {
        validationErrors["lastName"] = ["Last name is too long."];
    }

    if (string.IsNullOrWhiteSpace(email))
    {
        validationErrors["email"] = ["Email is required."];
    }
    else if (!new EmailAddressAttribute().IsValid(email))
    {
        validationErrors["email"] = ["Enter a valid email address."];
    }

    if (string.IsNullOrWhiteSpace(register.Password))
    {
        validationErrors["password"] = ["Password is required."];
    }

    if (validationErrors.Count > 0)
    {
        return Results.ValidationProblem(validationErrors);
    }

    var user = new AppUser
    {
        FirstName = firstName,
        LastName = lastName,
        Email = email,
        UserName = email,
    };

    var result = await userManager.CreateAsync(user, register.Password);
    if (!result.Succeeded)
    {
        return Results.ValidationProblem(
            result.Errors
                .GroupBy(error => error.Code)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(error => error.Description).ToArray()));
    }

    return Results.Ok();
});

app.MapPost("/token/login", async (
    HttpContext httpContext,
    LoginRequest login,
    SignInManager<AppUser> signInManager) =>
{
    signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;

    var tokenResponse = await ReadBearerTokenResponseAsync(
        httpContext,
        async () =>
        {
            var result = await signInManager.PasswordSignInAsync(
                login.Email?.Trim() ?? string.Empty,
                login.Password ?? string.Empty,
                isPersistent: false,
                lockoutOnFailure: true);

            return result.Succeeded;
        },
        jsonOptions);

    if (tokenResponse is null)
    {
        return Results.Unauthorized();
    }

    if (string.IsNullOrWhiteSpace(tokenResponse.AccessToken)) return Results.Problem("Identity did not return an access token.");

    SetRefreshTokenCookie(httpContext, refreshTokenCookieName, tokenResponse.RefreshToken);

    return Results.Ok(new AccessTokenResponse(
        tokenResponse.TokenType,
        tokenResponse.AccessToken,
        tokenResponse.ExpiresIn));
});

app.MapPost("/token/refresh", async (
    HttpContext httpContext,
    SignInManager<AppUser> signInManager,
    IOptionsMonitor<BearerTokenOptions> bearerTokenOptions) =>
{
    if (!httpContext.Request.Cookies.TryGetValue(refreshTokenCookieName, out var refreshToken) ||
        string.IsNullOrWhiteSpace(refreshToken))
    {
        return Results.Unauthorized();
    }

    var refreshTicket = bearerTokenOptions
        .Get(IdentityConstants.BearerScheme)
        .RefreshTokenProtector
        .Unprotect(refreshToken);

    if (refreshTicket?.Properties.ExpiresUtc is not { } expiresUtc ||
        DateTimeOffset.UtcNow >= expiresUtc)
    {
        httpContext.Response.Cookies.Delete(refreshTokenCookieName);
        return Results.Unauthorized();
    }

    var user = await signInManager.ValidateSecurityStampAsync(refreshTicket.Principal);
    if (user is null)
    {
        httpContext.Response.Cookies.Delete(refreshTokenCookieName);
        return Results.Unauthorized();
    }

    var newPrincipal = await signInManager.CreateUserPrincipalAsync(user);
    var tokenResponse = await ReadBearerTokenResponseAsync(
        httpContext,
        async () =>
        {
            await httpContext.SignInAsync(IdentityConstants.BearerScheme, newPrincipal);
            return true;
        },
        jsonOptions);

    if (tokenResponse is null || string.IsNullOrWhiteSpace(tokenResponse.AccessToken)) return Results.Problem("Identity did not return an access token.");

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

static async Task<TokenResponse?> ReadBearerTokenResponseAsync(
    HttpContext httpContext,
    Func<Task<bool>> issueTokensAsync,
    JsonSerializerOptions jsonOptions)
{
    var originalResponseBody = httpContext.Response.Body;
    await using var tokenResponseBody = new MemoryStream();

    httpContext.Response.Body = tokenResponseBody;

    try
    {
        var issuedTokens = await issueTokensAsync();
        if (!issuedTokens) return null;

        tokenResponseBody.Position = 0;
        using var reader = new StreamReader(tokenResponseBody);
        var responseBody = await reader.ReadToEndAsync();

        return JsonSerializer.Deserialize<TokenResponse>(responseBody, jsonOptions);
    }
    finally
    {
        httpContext.Response.Body = originalResponseBody;
    }
}

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

public sealed record AppRegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName);

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
