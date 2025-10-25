using Microsoft.EntityFrameworkCore;

namespace LernApp.Api.Entities;

public partial class CoreContext(DbContextOptions<CoreContext> options) : DbContext(options);