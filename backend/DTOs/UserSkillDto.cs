namespace SideKick.Server.DTOs
{
  public class UserSkillReponseDto
  {
    public required int UserId { get; set; }
    public required int SkillId { get; set; }
    public required string SkillName { get; set; }
  }

  public class PostUserSkillDto
  {
    public required int SkillId { get; set; }
  }
}
