using LernApp.Api.DTOs.Responses;
using LernApp.Api.Models;
using LernApp.Api.Models.Generic;
using LernApp.Api.Services;
using LernApp.Models;
using LernApp.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Api.Controller;

[ApiController]
[Route("api/learning")]
public class ProgressController(
    CoreContext context, 
    LearningService learningService
    ) : ControllerBase
{

    [HttpGet("session/{deckId}")]
    [Authorize]
    public async Task<ActionResult<LearningSessionResponse>> GetNextCards([FromRoute] Guid deckId)
    {
        return await learningService.GetLearningSessionAsync(User, deckId);
    }


    [HttpPost("update/{cardId}")]
    [Authorize]
    public async Task<IActionResult> UpdateCardProgress([FromRoute] Guid cardId, [FromQuery] CardRating rating)
    {
        await learningService.UpdateLearningStateAsync(User, cardId, rating);

        return Ok("Card updated");
    }
}