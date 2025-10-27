using LernApp.Api.Models;
using LernApp.Api.Models.Generic;
using LernApp.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LernApp.Api.Controller;

[ApiController]
[Route("/api/decks")]
public class DeckController(
    DeckService deckService,
    ILogger<IdentityController> logger) : ControllerBase
{

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ListResponse<DeckResponseModel>>> GetDecks()
    {
        return await deckService.ListDecksAsync(User);
    }

    [HttpPost]
    [Authorize]
    public async Task CreateDeck([FromBody] CreateRequest<DeckCreateModel> request)
    {
        await deckService.CreateDeckAsync(request, User);
    }



}