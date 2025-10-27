using LernApp.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LernApp.Models;

public partial class CoreContext(DbContextOptions options) : IdentityDbContext <
    IdentityUserEntity,
    IdentityRole<Guid>,
    Guid
>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.HasDefaultSchema("core");

        OnIdentityCreating(builder);
        OnLernCreating(builder);
    }
}