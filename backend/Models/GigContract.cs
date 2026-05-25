namespace GigApp.Server.Models
{
  public class GigContract
  {
    public int Id { get; set; }

    public int PostId { get; set; }

    public int ApplicationId { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}