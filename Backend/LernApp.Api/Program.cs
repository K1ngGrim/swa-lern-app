using LernApp.Api.Services;
using LernApp.Models;
using LernApp.Models.Identity;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder
    .Configuration
    .AddJsonFile($"appsettings.json", true, true)
    .AddJsonFile($"appsettings.Development.json", true, true)
    .AddJsonFile($"appsettings.{Environment.MachineName}.json", true, true)
    .AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("Database");

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerUI();
builder.Services.AddControllers();

builder.Services.AddDbContext<CoreContext>(options =>
{
    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("LernApp.Api"));
});

builder.Services
    .AddIdentityCore<IdentityUserEntity>()
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<CoreContext>()
    .AddSignInManager<SignInManager<IdentityUserEntity>>()
    .AddRoleManager<RoleManager<IdentityRole<Guid>>>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = IdentityConstants.ApplicationScheme;
        options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
        options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
        options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
    })
    .AddCookie(IdentityConstants.ApplicationScheme)
    .AddCookie("Identity.External") // Application-Cookie-Authentifizierung
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
        x => { x.Cookie.Name = "Identity.Application"; }); // Standard-Cookie-Authentifizierung

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 3;
    options.Password.RequiredUniqueChars = 0;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = false;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;

    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

builder.Services.AddScoped<DeckService>();

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CoreContext>();
    dbContext.Database.Migrate();
}

app.MapOpenApi();
app.MapSwaggerUI();
app.MapControllers();

app.Run();