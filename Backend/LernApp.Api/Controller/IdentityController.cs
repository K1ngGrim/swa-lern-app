using LernApp.Api.DTOs.Requests;
using LernApp.Api.DTOs.Responses;
using LernApp.Models;
using LernApp.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using LoginRequest = Microsoft.AspNetCore.Identity.Data.LoginRequest;

namespace LernApp.Api.Controller;

public class AuthResult
{
    public bool IsAuthenticated { get; set; }
    public Guid? UserId { get; set; }
    public string? Scheme { get; set; }
}

[ApiController]
[Route("/api/identity")]
public class IdentityController(
    CoreContext db,
    UserManager<IdentityUserEntity> userManager,
    SignInManager<IdentityUserEntity> signInManager,
    RoleManager<IdentityRole<Guid>> roleManager,
    ILogger<IdentityController> logger) : ControllerBase
{


    [HttpGet("test")]
    [AllowAnonymous]
    public ActionResult<AuthResult> IsLoggedIn()
    {
        return new AuthResult
        {
            IsAuthenticated = User.Identity?.IsAuthenticated ?? false,
            UserId = null,
            Scheme = User.Identity?.AuthenticationType
        };
    }

    [HttpPost("login")]
    public async Task<LoginResponse> LoginAsync(LoginRequest loginRequest)
    {
        var user = await userManager.FindByEmailAsync(loginRequest.Email);

        if (user == null)
            return new LoginResponse("Invalid username or password");

        try
        {
            var res = await signInManager.PasswordSignInAsync(user, loginRequest.Password, true, false);

            if (res.Succeeded)
            {
                return new LoginResponse();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

        return new LoginResponse("Invalid username or password");
    }

    [HttpPost("register")]
    public async Task<IdentityResponse> RegisterAsync([FromBody] AccountCreateRequest request)
    {
        var existingUser = await userManager.FindByEmailAsync(request.Mail);

        if (existingUser != null)
        {
            return new IdentityResponse("Email already exists");
        }

        var user = new IdentityUserEntity
        {
            UserName = request.UserName,
            Email = request.Mail,
            Created = DateTimeOffset.UtcNow,
            Modified = DateTimeOffset.UtcNow
        };

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return new IdentityResponse($"Failed to create user {user.NormalizedEmail}");
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        logger.LogInformation($"Token: {token}");

        return new IdentityResponse(null);
    }

}