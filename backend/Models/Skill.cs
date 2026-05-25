namespace SideKick.Server.Models
{
  public class Skill
  {
    public int Id { get; set; }

    public required string Name { get; set; }

    public bool IsGlobal { get; set; } = false;

    public string? UserId { get; set; }

    public AppUser? User { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();

    public List<AppUser> Users { get; set; } = [];

    public List<UserSkill> UserSkills { get; set; } = [];
    
  }
}