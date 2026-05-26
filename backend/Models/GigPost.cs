using System.ComponentModel.DataAnnotations;

namespace SideKick.Server.Models
{
    public class GigPost
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public AppUser? User { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        public List<GigApplication> Applications { get; set; } = [];

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
    }
}