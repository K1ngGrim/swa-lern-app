using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LernApp.Models.Entities;

namespace LernApp.Models.Data;

public class CardData : CardBase
{
    [Column("card_id")]
    public Guid CardId { get; set; }

    public CardState State { get; set; }
}

public class CardBase
{
    [Column("title")]
    [StringLength(255)]
    public required string Title { get; set; }

    [Column("front_page")]
    public required string Front { get; set; }

    [Column("back_page")]
    public required string Back { get; set; }

    [Column("deck_id")]
    public Guid DeckId { get; set; }
}