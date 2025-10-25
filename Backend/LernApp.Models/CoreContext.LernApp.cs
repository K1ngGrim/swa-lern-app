using LernApp.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Models;

public partial class CoreContext
{

    public DbSet<CardEntity> Cards => Set<CardEntity>();

    protected void OnLernCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CardEntity>(entity =>
        {
            entity.ToTable("card");
            entity.HasKey(x => x.CardId);
            entity.Property(x => x.CardId).HasColumnName("card_id");
            entity.Property(x => x.Front).HasMaxLength(1000);
            entity.Property(x => x.Back).HasMaxLength(1000);
        });
    }

}