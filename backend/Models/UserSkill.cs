using Microsoft.EntityFrameworkCore;

namespace SideKick.Server.Models
{
    [Index(nameof(UserId), nameof(SkillId), IsUnique = true)]
    public class UserSkill
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public AppUser? User { get; set; }

        public int SkillId { get; set; }

        public Skill? Skill { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
    }
}
