using LernApp.Api.Services;
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
    public async Task<IActionResult> GetCards()
    {
        throw new Exception("Not implemented");
    }

    [HttpGet("{deckId}")]
    public async Task<IActionResult> GetCardsByDeck([FromRoute] string deckId)
    {
        throw new Exception("Not implemented");
    }

    [HttpGet("card/{cardId}")]
    public async Task<IActionResult> GetCard([FromRoute] string cardId)
    {
        throw new Exception("Not implemented");
    }

    [HttpPost]
    public async Task<IActionResult> CreateCard()
    {
        throw new Exception("Not implemented");
    }

    [HttpPut("{cardId}")]
    public async Task<IActionResult> UpdateCard([FromRoute] string cardId)
    {
        throw new Exception("Not implemented");
    }

    [HttpDelete("{cardId}")]
    public async Task<IActionResult> DeleteCard([FromRoute] string cardId)
    {
        throw new Exception("Not implemented");
    }

}