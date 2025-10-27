using System.ComponentModel.DataAnnotations.Schema;
using LernApp.Models.Core;
using LernApp.Models.Data;
using LernApp.Models.Identity;

namespace LernApp.Models.Entities;

public class DeckEntity : DeckData, IBaseEntity
{
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }

    [ForeignKey(nameof(UserId))]
    public IdentityUserEntity User { get; set; }

    public ICollection<CardEntity> Cards { get; set; } = new List<CardEntity>();
}