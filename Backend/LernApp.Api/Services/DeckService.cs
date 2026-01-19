using LernApp.Api.Models;
using LernApp.Api.Models.Generic;
using LernApp.Models;
using LernApp.Models.Data;
using LernApp.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Api.Services;

public class DeckService(
    CoreContext context,
    ILogger<DeckService> logger
    )
{

    public async Task<ListResponse<DeckResponseModel>> ListDecksAsync(Invoker invoker)
    {
        
        var lastLearnedMap = await context.Statistic
            .AsNoTracking()
            .Where(x => x.UserId == invoker.UserId)
            .GroupBy(x => x.DeckId)
            .ToDictionaryAsync(
                x => x.Key, 
                x => 
                    x.Max(s => s.Date));
        
        var decks = await context.Decks
            .AsNoTracking()
            .Where(x => x.UserId == invoker.UserId)
            .Select(x => x.DeckId)
            .ToListAsync();

        var cards = context.Cards
            .AsNoTracking()
            .Where(x =>
                decks.Contains(x.DeckId))
            .AsQueryable();

        var cardsStatMap = await cards
            .GroupBy(x => x.DeckId)
            .ToDictionaryAsync(x => x.Key, x =>
                new CardStatDto
                {
                    NewCards = x.Count(s => s.State == CardState.New),
                    LearningCards = x.Count(s => s.State is CardState.Learning or CardState.Relearning),
                    ReviewCards = x.Count(s => s.State == CardState.Review),
                });

        var decksn = await context.Decks
            .AsNoTracking()
            .Include(x => x.Cards)
            .Where(x => x.UserId == invoker.UserId)
            .Select(x => new
            {
                x.DeckId,
                x.Name,
                x.Description,
                x.UserId,
                CardCount = x.Cards.Count
            })
            .ToListAsync();

        
        var result = decksn.Select(x =>
        {
            var stats = cardsStatMap.GetValueOrDefault(x.DeckId);

            return new DeckResponseModel
            {
                DeckId = x.DeckId,
                Name = x.Name,
                Description = x.Description,
                CardCount = x.CardCount,
                UserId = x.UserId,

                LastLearned = lastLearnedMap.GetValueOrDefault(x.DeckId),

                CardsLearning  = stats?.LearningCards ?? 0,
                CardsNew       = stats?.NewCards ?? 0,
                CardsReviewing = stats?.ReviewCards ?? 0
            };
        }).ToList();

        var count = result.Count;

        return new ListResponse<DeckResponseModel>(result, count);
    }

    public async Task CreateDeckAsync(CreateRequest<DeckCreateModel> request, Invoker invoker)
    {
        if (request.EntityId.HasValue && await context.Decks.AnyAsync(x => x.DeckId == request.EntityId))
            throw new Exception("Deck already exists");

        var entity = context.Decks.Add(
            new DeckEntity
            {
                DeckId = Guid.NewGuid(),
                UserId = invoker.UserId,
                Created = DateTimeOffset.UtcNow,
                CreatorId = invoker.UserId,
                Modified = null,
                ModifierId = null,
                Name = request.Data.Name,
                Description = request.Data.Description
            });

        await context.SaveChangesAsync();
    }

    public async Task<DeckDetailResponseModel> GetDeckDetailAsync(Guid deckId, Invoker invoker)
    {
        var exists = await context.Decks.AnyAsync(x => x.DeckId == deckId && x.UserId == invoker.UserId);
        
        if(!exists)
            throw new Exception("Deck not found");

        return await context.Decks
            .Where(x => x.DeckId == deckId && x.UserId == invoker.UserId)
            .Include(y => y.Cards)
            .Select(x => new DeckDetailResponseModel
            {
                DeckId = deckId,
                Name = x.Name,
                Description = x.Description,
                UserId = x.UserId,
                Cards = x.Cards
                    .Select(y => new CardData
                    {
                        Back = y.Back,
                        Front = y.Front,
                        Title = y.Title,
                        CardId = y.CardId,
                        DeckId = y.DeckId,
                    }).ToList()

            }).SingleAsync();
    }


}

public class CardStatDto
{
    public int NewCards { get; init; }
    public int LearningCards { get; init; }
    public int ReviewCards { get; init; }
}
