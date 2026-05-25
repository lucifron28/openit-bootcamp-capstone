using Microsoft.EntityFrameworkCore;

namespace SideKick.Server.Models
{
    [Index(nameof(PostId), nameof(UserId), IsUnique = true)]
    public class GigApplication
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public AppUser? User { get; set; }

        public int PostId { get; set; }

        public GigPost? Post { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
    }
}
