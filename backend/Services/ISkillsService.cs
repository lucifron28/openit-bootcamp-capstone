using SideKick.Server.DTOs;

namespace SideKick.Server.Services
{
  public interface ISkillsService
  {
    public List<SkillResponseDto> GetAllSkills();
    public List<SkillResponseDto> GetAllSkillsOfUser(int userId);
    public SkillResponseDto CreateSkill(int userId, PostSkillDto skill);
    public SkillResponseDto? GetSkillById(int skillId);
    public void DeleteSkillById(int skillId);
    public List<SkillResponseDto> GetAssignedSkillsForUser(int userId);
    public UserSkillReponseDto? GetAssignedSkillForUserById(int userId, int skillId);
    public UserSkillReponseDto? AssignSkillToUser(int userId, int skillId);
    public void UnassignSkillFromUser(int userId, int skillId);
  }
}
