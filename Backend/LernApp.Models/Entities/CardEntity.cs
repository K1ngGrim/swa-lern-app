using LernApp.Models.Core;
using LernApp.Models.Data;

namespace LernApp.Models.Entities;

public class CardEntity : CardData, IBaseEntity
{
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }
}