using LernApp.Api.DTOs.Responses;
using LernApp.Api.Models;
using LernApp.Api.Models.Generic;
using LernApp.Models;
using LernApp.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Api.Services;

public class LearningService(
    CoreContext context,
    ILogger<LearningService> logger
)
{

    public async Task<LearningSessionResponse> GetLearningSessionAsync(Invoker invoker, Guid deckId)
    {
        var cards = await context.Cards
            .Include(x => x.Deck)
            .Where(x => x.Deck.UserId == invoker.UserId && x.DeckId == deckId)
            .Where(x => x.DueDate < DateTimeOffset.UtcNow)
            .OrderBy(x => x.DueDate)
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


        return new LearningSessionResponse
        {
            Cards = cards,
        };
    }

    public async Task UpdateLearningStateAsync(Guid cardId, CardRating rating)
    {
        var card = await context.Cards.Where(x => x.CardId == cardId)
            .SingleAsync();

        if (card == null) throw new Exception("Card not found");

        var now = DateTimeOffset.UtcNow;

        switch (card.State)
        {
            case CardState.New:
            {
                switch (rating)
                {
                    case CardRating.Again:
                        card.DueDate = now;
                        break;
                    case CardRating.Hard:
                        card.State = CardState.Learning;
                        card.DueDate = now + TimeSpan.FromMinutes(5);
                        card.Interval = 0;
                        break;
                    case CardRating.Good:
                        card.State = CardState.Learning;
                        card.DueDate = now + TimeSpan.FromMinutes(15);
                        card.Interval = 0;
                        break;
                    case CardRating.Easy:
                    default:
                        card.State = CardState.Review;
                        card.Interval = 3;
                        card.DueDate = now + TimeSpan.FromDays(3);
                        break;
                }
                break;
            }

            case CardState.Learning:
            {
                switch (rating)
                {
                    case CardRating.Again:
                        card.DueDate = now + TimeSpan.FromMinutes(1);
                        break;
                    case CardRating.Hard:
                        card.State = CardState.Learning;
                        card.DueDate = now + TimeSpan.FromMinutes(10);
                        card.Interval = 0;
                        break;
                    case CardRating.Easy:
                    case CardRating.Good:
                    default:
                        card.State = CardState.Review;
                        card.Interval = 1;
                        card.DueDate = now + TimeSpan.FromDays(1);
                        break;
                }

                break;
            }

            case CardState.Relearning:
            {
                if (rating == CardRating.Again)
                {
                    card.State = CardState.Relearning;
                    card.DueDate = now + TimeSpan.FromMinutes(1);
                }
                else
                {

                    card.Interval = double.Max(1, (card.Interval / 2));
                    card.DueDate = now + TimeSpan.FromDays(card.Interval);
                }
                break;
            }

            case CardState.Review:
            {
                if (rating == CardRating.Again)
                {
                    card.State = CardState.Relearning;
                    card.DueDate = now + TimeSpan.FromMinutes(1);
                }
                else
                {
                    var multiplier = 0D;

                    if (rating == CardRating.Hard) multiplier = 1.2;
                    else if (rating == CardRating.Good) multiplier = 2;
                    else multiplier = 3;

                    card.Interval = double.Max(1, (card.Interval * multiplier));
                    card.DueDate = now + TimeSpan.FromDays(card.Interval);
                }

                break;
            }
        }
        await context.SaveChangesAsync();
    }



}