using LernApp.Api.Models;
using LernApp.Api.Models.Generic;
using LernApp.Models;
using LernApp.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Api.Services;

public class CardService(
    CoreContext context,
    ILogger<CardService> logger
)
{
    
    public async Task<List<CardResponseModel>> GetCardsAsync(Invoker invoker)
    {
        var cards = await context.Cards
            .Include(x => x.Deck)
            .Where(x => x.Deck.UserId == invoker.UserId)
            .Select(x => new CardResponseModel
            {
                Back = x.Back,
                Front = x.Front,
                Title = x.Title,
                CardId = x.CardId,
                DeckId = x.DeckId
            })
            .ToListAsync();
        
        return cards;
    }
    
    public async Task<List<CardResponseModel>> GetCardsByDeckAsync(Guid deckId, Invoker invoker)
    {
        var cards = await context.Cards
            .Include(x => x.Deck)
            .Where(x => x.Deck.UserId == invoker.UserId && x.DeckId == deckId)
            .Select(x => new CardResponseModel
            {
                Back = x.Back,
                Front = x.Front,
                Title = x.Title,
                CardId = x.CardId,
                DeckId = x.DeckId,
                State = x.State,
            })
            .ToListAsync();
        
        return cards;
    }
    
    public async Task<CardResponseModel> GetCardAsync(Guid cardId, Invoker invoker)
    {
        var card = await context.Cards
            .Include(x => x.Deck)
            .Where(x => x.Deck.UserId == invoker.UserId && x.CardId == cardId)
            .Select(x => new CardResponseModel
            {
                Back = x.Back,
                Front = x.Front,
                Title = x.Title,
                CardId = x.CardId,
                DeckId = x.DeckId
            })
            .FirstOrDefaultAsync();
        
        return card ?? throw new Exception("Card not found");
    }
    
    public async Task<Guid> CreateCardAsync(CardCreateModel request, Invoker invoker)
    {
        var deck = await context.Decks
            .Where(x => x.DeckId == request.DeckId && x.UserId == invoker.UserId)
            .FirstOrDefaultAsync();
        
        if (deck == null)
        {
            throw new Exception("Deck not found");
        }
        
        var card = new CardEntity
        {
            CardId = Guid.NewGuid(),
            Title = request.Title,
            Front = request.Front,
            Back = request.Back,
            DeckId = request.DeckId,
            Deck = deck,
            DueDate = DateTimeOffset.UtcNow,
            Created = DateTimeOffset.UtcNow,
            CreatorId = invoker.UserId,
        };
        
        context.Cards.Add(card);
        await context.SaveChangesAsync();

        return card.CardId;
    }
    
    public async Task UpdateCardAsync(Guid cardId, CardCreateModel request, Invoker invoker)
    {
        var card = await context.Cards
            .Include(x => x.Deck)
            .Where(x => x.CardId == cardId && x.Deck.UserId == invoker.UserId)
            .FirstOrDefaultAsync();
        
        if (card == null)
        {
            throw new Exception("Card not found");
        }
        
        card.Title = request.Title;
        card.Front = request.Front;
        card.Back = request.Back;
        
        await context.SaveChangesAsync();
    }
    
    public async Task DeleteCardAsync(Guid cardId, Invoker invoker)
    {
        var card = await context.Cards
            .Include(x => x.Deck)
            .Where(x => x.CardId == cardId && x.Deck.UserId == invoker.UserId)
            .FirstOrDefaultAsync();
        
        if (card == null)
        {
            throw new Exception("Card not found");
        }
        
        context.Cards.Remove(card);
        await context.SaveChangesAsync();
    }
    
}