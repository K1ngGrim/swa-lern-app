using LernApp.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Models;

public partial class CoreContext
{

    public DbSet<CardEntity> Cards => Set<CardEntity>();
    public DbSet<DeckEntity> Decks => Set<DeckEntity>();
    public DbSet<StatisticEntity> Statistic => Set<StatisticEntity>();

    protected void OnLernCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CardEntity>(entity =>
        {
            entity.ToTable("card");
            entity.HasKey(x => x.CardId);
            entity.Property(x => x.DeckId);
            entity.Property(x => x.CardId).HasColumnName("card_id");
            entity.Property(x => x.Front).HasMaxLength(1000);
            entity.Property(x => x.Back).HasMaxLength(1000);

            entity
                .HasOne(c => c.Deck)
                .WithMany(d => d.Cards)
                .HasForeignKey(c => c.DeckId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DeckEntity>(entity =>
        {
            entity.ToTable("deck");
            entity.HasKey(x => x.DeckId);
            entity.Property(x => x.DeckId).HasColumnName("deck_id");

            entity
                .HasOne(d => d.User)
                .WithMany(u => u.Decks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StatisticEntity>(entity =>
        {
            entity.ToTable("statistic");
            entity
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(s => s.Deck)
                .WithMany()
                .HasForeignKey(a => a.DeckId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StatisticEntity>().OwnsOne(entity =>
            entity.Data, ownedNavigationBuilder =>
        {
            ownedNavigationBuilder.ToJson();
        });
    }

}