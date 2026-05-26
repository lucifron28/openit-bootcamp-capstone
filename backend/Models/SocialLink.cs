using System.ComponentModel.DataAnnotations;

namespace SideKick.Server.Models
{
    public class SocialLink
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public AppUser? User { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(300)]
        public string Href { get; set; } = string.Empty;

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
    }
}