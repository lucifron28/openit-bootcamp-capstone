namespace SideKick.Server.Models
{
  public class GigPost
  {
    public int Id { get; set; }

    public required string UserId { get; set; }

    public AppUser? User { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}