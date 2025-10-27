using System.ComponentModel.DataAnnotations.Schema;
using LernApp.Models.Entities;
using LernApp.Models.Identity;

namespace LernApp.Models.Data;

public class DeckData : DeckBase
{
    [Column("deck_id")]
    public Guid DeckId { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }
}

public class DeckBase
{
    [Column("name")]
    public required string Name { get; set; }

    [Column("description")]
    public string Description { get; set; } = string.Empty;
}