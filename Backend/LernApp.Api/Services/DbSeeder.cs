using LernApp.Models;
using LernApp.Models.Entities;
using LernApp.Models.Identity;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Api.Services;

public static class DbSeeder
{
    public static async Task SeedAsync(CoreContext context)
    {
        // DB anlegen falls nicht existiert
        await context.Database.MigrateAsync();
        
        if (context.Decks.Any())
            return;

        var random = new Random();

        var user = await context.Users.FirstOrDefaultAsync();

        var userId = user?.Id??Guid.Empty;

        // ============================
        // Decks
        // ============================

        var decks = new List<DeckEntity>();

        for (int d = 1; d <= 3; d++)
        {
            var deck = new DeckEntity
            {
                DeckId = Guid.NewGuid(),
                UserId = userId,
                Name = $"Demo Deck {d}",
                Description = $"Seeded Deck {d}",
                CreatorId = userId,
                Created = DateTimeOffset.UtcNow
            };

            decks.Add(deck);
        }

        context.Decks.AddRange(decks);
        await context.SaveChangesAsync();

        // ============================
        // Cards
        // ============================

        var cards = new List<CardEntity>();

        foreach (var deck in decks)
        {
            var cardCount = random.Next(10, 21);

            for (int i = 1; i <= cardCount; i++)
            {
                cards.Add(new CardEntity
                {
                    CardId = Guid.NewGuid(),
                    DeckId = deck.DeckId,
                    Deck = deck,

                    Title = $"Card {i}",
                    Front = $"Front content {i}",
                    Back = $"Back content {i}",

                    State = CardState.New,

                    Repetitions = 0,
                    Interval = 0,
                    DueDate = DateTimeOffset.UtcNow.AddDays(random.Next(1, 30)),

                    CreatorId = userId,
                    Created = DateTimeOffset.UtcNow
                });
            }
        }

        context.Cards.AddRange(cards);

        // ============================
        // Statistics
        // ============================

        var statistics = new List<StatisticEntity>();

        foreach (var deck in decks)
        {
            var entries = random.Next(40, 80);

            for (int i = 0; i < entries; i++)
            {
                var dayOfYear = random.Next(1, DateTime.Now.DayOfYear);

                statistics.Add(new StatisticEntity
                {
                    StatisticId = Guid.NewGuid(),
                    DeckId = deck.DeckId,
                    Deck = deck,

                    UserId = userId,

                    Date = DateOnly.FromDateTime(
                        new DateTime(2026, 1, 1).AddDays(dayOfYear)
                    ),

                    Data = new StatisticData
                    {
                        CardsLearned = random.Next(0, 25)
                    }
                });
            }
        }

        context.Statistic.AddRange(statistics);

        await context.SaveChangesAsync();
    }
}