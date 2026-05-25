namespace GigApp.Server.Models
{
  public class GigApplication
  {
    public int Id { get; set; }

    public int UserId { get; set; }

    public int PostId { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}