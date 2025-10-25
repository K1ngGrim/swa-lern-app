using LernApp.Models.Core;
using Microsoft.AspNetCore.Identity;

namespace LernApp.Models.Identity;

public class IdentityUserEntity : IdentityUser<Guid>, IBaseEntity
{
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }
}