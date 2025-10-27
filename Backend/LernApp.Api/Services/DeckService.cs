using LernApp.Api.Models;
using LernApp.Api.Models.Generic;
using LernApp.Models;
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

        var result = await context.Decks
            .AsNoTracking()
            .Select(x => new DeckResponseModel
            {
                DeckId = x.DeckId,
                Name = x.Name,
                Description = x.Description,
                UserId = x.UserId,
            })
            .Where(x => x.UserId == invoker.UserId)
            .ToListAsync();

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


}