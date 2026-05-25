using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SideKick.Server.Models
{
    public class Skill
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public bool IsGlobal { get; set; } = false;

        public int? UserId { get; set; }

        public AppUser? User { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();

        [NotMapped]
        public List<AppUser> Users { get; set; } = [];

        public List<UserSkill> UserSkills { get; set; } = [];
    }
}
