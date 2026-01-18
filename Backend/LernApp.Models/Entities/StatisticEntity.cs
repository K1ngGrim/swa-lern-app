using System.ComponentModel.DataAnnotations.Schema;
using LernApp.Models.Identity;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Models.Entities;

[PrimaryKey(nameof(StatisticId))]
public class StatisticEntity : StatisticBase
{
    [ForeignKey(nameof(UserId))]
    public IdentityUserEntity User { get; set; }
    
    [ForeignKey(nameof(DeckId))]
    public DeckEntity Deck { get; set; }
    
    [Column("user_id")]
    public Guid UserId { get; set; }
}

public class StatisticBase
{
    public Guid StatisticId { get; set; }
    
    public Guid DeckId { get; set; }
    
    [Column("date")]
    public DateOnly Date { get; set; }
    
    public StatisticData Data { get; set; }
}

public class StatisticData
{
    public int CardsLearned { get; set; } = 0;
}