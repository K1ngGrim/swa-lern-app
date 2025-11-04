using LernApp.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Models;

public partial class CoreContext
{

    public DbSet<CardEntity> Cards => Set<CardEntity>();
    public DbSet<DeckEntity> Decks => Set<DeckEntity>();
    public DbSet<ProgressEntity> Progression => Set<ProgressEntity>();

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

        modelBuilder.Entity<ProgressEntity>(entity =>
        {
            entity.ToTable("progress");
            entity.HasKey(x => x.ProgressId);
            entity.Property(x => x.ProgressId).HasColumnName("progress_id");

            entity
                .HasOne(p => p.Card)
                .WithOne(c => c.Progress)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

}