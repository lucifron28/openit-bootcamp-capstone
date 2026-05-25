namespace GigApp.Server.Models
{
  public class SocialLink
  {
    public int Id { get; set; }

    public int UserId { get; set; }
    
    public AppUser? User { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string Href { get; set; } = string.Empty;
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}