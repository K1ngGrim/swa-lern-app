using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Api.Entities;

public partial class CoreContext : IdentityDbContext<IdentityUser, IdentityRole, string>
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Optional: Identity-Tabellennamen anpassen
        builder.Entity<IdentityUser>(b => b.ToTable("Users"));
        builder.Entity<IdentityRole>(b => b.ToTable("Roles"));
        builder.Entity<IdentityUserRole<string>>(b => b.ToTable("UserRoles"));
        builder.Entity<IdentityUserClaim<string>>(b => b.ToTable("UserClaims"));
        builder.Entity<IdentityRoleClaim<string>>(b => b.ToTable("RoleClaims"));
        builder.Entity<IdentityUserLogin<string>>(b => b.ToTable("UserLogins"));
        builder.Entity<IdentityUserToken<string>>(b => b.ToTable("UserTokens"));
    }
}