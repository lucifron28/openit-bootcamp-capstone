namespace GigApp.Server.Models
{
  public class Skill
  {
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsGlobal { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}