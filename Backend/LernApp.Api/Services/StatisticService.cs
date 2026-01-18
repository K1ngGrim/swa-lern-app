using System.Runtime.InteropServices.JavaScript;
using LernApp.Api.Models;
using LernApp.Api.Models.Generic;
using LernApp.Models;
using LernApp.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Api.Services;

public class StatisticService(
    CoreContext context,
    ILogger<StatisticService> logger
    
)
{

    public async Task<StatisticSummaryResponseModel> GetStatisticsSummary(Invoker invoker)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        
        var weekStart = today.AddDays(-(int)today.DayOfWeek + (today.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));
        
        var weekEnd = weekStart.AddDays(6);

        var learnedWeek = await context.Statistic
            .AsNoTracking()
            .Where(x => x.UserId == invoker.UserId)
            .Where(x => x.Date >= weekStart && x.Date <= weekEnd)
            .CountAsync();

        var learnedToday = await context.Statistic
            .AsNoTracking()
            .Where(x => x.UserId == invoker.UserId)
            .Where(x => x.Date == DateOnly.FromDateTime(DateTime.UtcNow))
            .CountAsync();

        return new StatisticSummaryResponseModel
        {
            LearnedThisWeek = learnedWeek,
            LearnedToday = learnedToday
        };
    }

    public async Task<StatisticResponseModel> GetHeatMapDataAsync(Invoker invoker, Guid? deckId)
    {

        var stats = await context.Statistic
            .AsNoTracking()
            .Where(x => x.UserId == invoker.UserId)
            .Select(x => new StatisticModel
            {
                Data = x.Data,
                Date =  x.Date.AddDays(-1),
                DeckId = x.DeckId,
            })
            .ToListAsync();

        if (deckId != null)
        {
            stats = stats
                .Where(x => x.DeckId == deckId)
                .ToList();
        }

        return new StatisticResponseModel
        {
            Data = stats
        };
    }

    public async Task IncrementCardStatistic(Invoker invoker, Guid deckId)
    {

        var stats = await context.Statistic
            .Where(x => x.UserId == invoker.UserId && x.DeckId == deckId)
            .Where(x => x.Date == DateOnly.FromDateTime(DateTime.UtcNow))
            .SingleOrDefaultAsync();

        if (stats == null)
        {
            stats = new StatisticEntity
            {
                DeckId = deckId,
                UserId = invoker.UserId,
                Date = DateOnly.FromDateTime(DateTime.UtcNow),
                Data = new StatisticData
                {
                    CardsLearned = 0
                }
            };
            
            await context.Statistic.AddAsync(stats);
        }

        stats.Data.CardsLearned++;
        
        await context.SaveChangesAsync();
    }

}