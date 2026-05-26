using SideKick.Server.DTOs;

namespace SideKick.Server.Services
{
  public interface ISkillsService
  {
    public List<SkillResponseDto> GetAllSkills();
    public List<SkillResponseDto> GetAllSkillsOfUser(string userId);
    public SkillResponseDto CreateSkill(string userId, PostSkillDto skill);
    public SkillResponseDto? GetSkillById(int skillId);
    public void DeleteSkillById(int skillId);
    public List<SkillResponseDto> GetAssignedSkillsForUser(string userId);
    public UserSkillReponseDto? GetAssignedSkillForUserById(string userId, int skillId);
    public UserSkillReponseDto? AssignSkillToUser(string userId, int skillId);
    public void UnassignSkillFromUser(string userId, int skillId);
  }
}