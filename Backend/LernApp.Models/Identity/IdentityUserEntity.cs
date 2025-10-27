using LernApp.Models.Core;
using LernApp.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace LernApp.Models.Identity;

public class IdentityUserEntity : IdentityUser<Guid>, IBaseEntity
{
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }

    public ICollection<DeckEntity> Decks { get; set; } = new List<DeckEntity>();
}