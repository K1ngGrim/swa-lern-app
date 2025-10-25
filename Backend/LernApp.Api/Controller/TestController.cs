using Microsoft.AspNetCore.Mvc;

namespace LernApp.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    
    [HttpGet("alive")]
    public IActionResult Get()
    {
        return Ok("The API is alive!");
    }
    
    
}