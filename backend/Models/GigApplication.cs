namespace SideKick.Server.Models
{
  public class GigApplication
  {
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public AppUser? User { get; set; }

    public int PostId { get; set; }

    public GigPost? Post { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}