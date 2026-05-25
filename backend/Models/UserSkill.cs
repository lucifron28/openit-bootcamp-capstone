namespace GigApp.Server.Models
{
  public class UserSkill
  {
    public int Id { get; set; }

    public int UserId { get; set; }

    public int SkillId { get; set; }
    public Skill? Skills { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}