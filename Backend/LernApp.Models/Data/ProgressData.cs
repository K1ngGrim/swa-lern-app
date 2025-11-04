using System.ComponentModel.DataAnnotations.Schema;
using LernApp.Models.Entities;

namespace LernApp.Models.Data;

public class ProgressData : ProgressBase
{
    
    
}

public class ProgressBase
{
    [Column("progress_id")]
    public Guid ProgressId { get; set; }
    
    [ForeignKey(nameof(Card))]
    public Guid CardId { get; set; }
    public required CardEntity Card { get; set; }
    
    public int Progression { get; set; }
}