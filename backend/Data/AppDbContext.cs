using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SideKick.Server.Models;

namespace SideKick.Server.Data
{
    public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<int>, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<SocialLink> SocialLinks { get; set; } = null!;

        public DbSet<Skill> Skills { get; set; } = null!;

        public DbSet<UserSkill> UserSkills { get; set; } = null!;

        public DbSet<Transaction> Transactions { get; set; } = null!;

        public DbSet<GigPost> GigPosts { get; set; } = null!;

        public DbSet<GigApplication> GigApplications { get; set; } = null!;

        public DbSet<GigContract> GigContracts { get; set; } = null!;

        public DbSet<GigPayment> GigPayments { get; set; } = null!;
    }
}
