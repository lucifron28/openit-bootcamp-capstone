namespace GigApp.Server.Models
{
  public class GigPost
  {
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}