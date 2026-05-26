using SideKick.Server.Data;
using SideKick.Server.Models;
using Microsoft.EntityFrameworkCore;
using SideKick.Server.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddControllers();

builder.Services.AddScoped<IMeService, MeService>();
builder.Services.AddScoped<ISkillsService, SkillsService>();
builder.Services.AddScoped<IGigPostsService, GigPostsService>();

builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<AppDbContext>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapIdentityApi<AppUser>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();