using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace SideKick.Server.Models
{
    public class AppUser : IdentityUser<int>
    {
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();

        public List<SocialLink> SocialLinks { get; set; } = [];

        public List<UserSkill> UserSkills { get; set; } = [];

        public List<GigPost> GigPosts { get; set; } = [];

        public List<GigApplication> GigApplications { get; set; } = [];
    }
}
