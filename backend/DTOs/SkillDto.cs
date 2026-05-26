namespace SideKick.Server.DTOs
{
  public class SkillResponseDto
  {
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required bool IsGlobal { get; set; }
    public required int? UserId { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
  }

  public class PostSkillDto
  {
    public required string Name { get; set; }
  }
}
