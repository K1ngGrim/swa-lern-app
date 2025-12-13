using System.ComponentModel.DataAnnotations.Schema;
using LernApp.Models.Core;
using LernApp.Models.Data;

namespace LernApp.Models.Entities;

public class CardEntity : CardData, IBaseEntity
{
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }

    [ForeignKey(nameof(DeckId))]
    public required DeckEntity Deck { get; set; }

    //Learning Progress

    public int Repetitions  { get; set; }
    public double Interval { get; set; }

    [Column("due_date")]
    public DateTimeOffset DueDate { get; set; }

}

public enum CardState
{
    New,
    Learning,
    Review,
    Relearning
}

public enum CardRating {
    Again,
    Hard,
    Good,
    Easy
}