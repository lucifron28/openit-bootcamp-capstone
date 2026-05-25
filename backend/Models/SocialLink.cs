namespace SideKick.Server.Models
{
  public class SocialLink
  {
    public int Id { get; set; }

    public required string UserId { get; set; }

    public AppUser? User { get; set; }

    public required string Name { get; set; }
    
    public required string Href { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}