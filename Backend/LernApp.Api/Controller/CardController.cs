using LernApp.Api.Models;
using LernApp.Api.Models.Generic;
using LernApp.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LernApp.Api.Controller;

[ApiController]
[Route("/api/cards")]
public class CardController(
    ILogger<CardController> logger,
    CardService cardService
    ) : ControllerBase
{

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<CardResponseModel>>> GetCards()
    {
        return await cardService.GetCardsAsync(User);
        
    }

    [HttpGet("{deckId}")]
    [Authorize]
    public async Task<ActionResult<List<CardResponseModel>>> GetCardsByDeck([FromRoute] Guid deckId)
    {
        return await cardService.GetCardsByDeckAsync(deckId, User);
    }

    [HttpGet("card/{cardId}")]
    [Authorize]
    public async Task<ActionResult<CardResponseModel>> GetCard([FromRoute] Guid cardId)
    {
        return await cardService.GetCardAsync(cardId, User);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpsertCard([FromBody] CreateRequest<CardCreateModel> request)
    {
        try
        {
            if (request.EntityId == null)
            {
                var cardId = await cardService.CreateCardAsync(request.Data, User);

                return Created("Card created", cardId);
            }

            await cardService.UpdateCardAsync(request.EntityId.Value, request.Data, User);
            return Ok("Card updated");
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error creating card");
            throw;
        }
        
    }

    [HttpDelete("{cardId}")]
    [Authorize]
    public async Task<IActionResult> DeleteCard([FromRoute] Guid cardId)
    {
        try
        {
            await cardService.DeleteCardAsync(cardId, User);
            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error deleting card");
            throw;
        }
    }

}