using GigApp.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GigApp.Server.Data {
  public class AppDbContext : IdentityDbContext<AppUser>
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<SocialLink> SocialLinks { get; set; }

    public DbSet<Skill> Skills { get; set; }

    public DbSet<UserSkill> UserSkills { get; set; }

    public DbSet<Transaction> Transactions { get; set; }

    public DbSet<GigPost> GigPosts { get; set; }

    public DbSet<GigApplication> GigApplications { get; set; }

    public DbSet<GigContract> GigContracts { get; set; }

    public DbSet<GigPayment> GigPayments { get; set; }
  }
}