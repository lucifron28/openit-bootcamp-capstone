using Microsoft.EntityFrameworkCore;
using SideKick.Server.Data;
using SideKick.Server.DTOs;
using SideKick.Server.Models;

namespace SideKick.Server.Services
{
  public class SkillsService : ISkillsService
  {
    private readonly AppDbContext _context;

    public SkillsService(AppDbContext context)
    {
      _context = context;
    }

    public List<SkillResponseDto> GetAllSkills()
    {
      return _context.Skills
        .Select(s => new SkillResponseDto
        {
          Id = s.Id,
          Name = s.Name,
          IsGlobal = s.IsGlobal,
          UserId = s.UserId,
          CreatedAt = s.CreatedAt,
        })
        .ToList();
    }

    public List<SkillResponseDto> GetAllSkillsOfUser(string userId)
    {
      return _context.Skills
        .Where(s => s.IsGlobal || s.UserId == userId)
        .Select(s => new SkillResponseDto
        {
          Id = s.Id,
          Name = s.Name,
          IsGlobal = s.IsGlobal,
          UserId = s.UserId,
          CreatedAt = s.CreatedAt,
        })
        .ToList();
    }

    public SkillResponseDto CreateSkill(string userId, PostSkillDto newSkill)
    {
      var skill = new Skill
      {
        Name = newSkill.Name,
        IsGlobal = false,
        UserId = userId,
      };

      _context.Skills.Add(skill);

      _context.SaveChanges();

      var createdSkill = _context.Skills
        .First(s => s.Id == skill.Id);

      return new SkillResponseDto
      {
        Id = createdSkill.Id,
        Name = createdSkill.Name,
        IsGlobal = createdSkill.IsGlobal,
        UserId = userId,
        CreatedAt = createdSkill.CreatedAt
      };
    }

    public SkillResponseDto? GetSkillById(int skillId)
    {
      return _context.Skills
        .Where(s => s.Id == skillId)
        .Select(s => new SkillResponseDto
          {
            Id = s.Id,
            Name = s.Name,
            IsGlobal = s.IsGlobal,
            UserId = s.UserId,
            CreatedAt = s.CreatedAt
          }
        )
        .FirstOrDefault();
    }

    public void DeleteSkillById(int skillId)
    {
      var skill = _context.Skills.FirstOrDefault(s => s.Id == skillId);
      if (skill == null) return;
      _context.Remove(skill);
      _context.SaveChanges();
    }

    public List<SkillResponseDto> GetAssignedSkillsForUser(string userId)
    {
      return _context.UserSkills
        .Where(us => us.UserId == userId)
        .Include(us => us.Skill)
        .Select(us => new SkillResponseDto
        {
          Id = us.Skill!.Id,
          Name = us.Skill.Name,
          IsGlobal = us.Skill.IsGlobal,
          UserId = us.Skill.UserId,
          CreatedAt = us.Skill.CreatedAt,
        })
        .ToList();
    }

    public UserSkillReponseDto? GetAssignedSkillForUserById(
      string userId,
      int skillId
    )
    {
      return _context.UserSkills
        .Where(us => us.UserId == userId && us.SkillId == skillId)
        .Include(us => us.Skill)
        .Select(us => new UserSkillReponseDto
        {
          UserId = userId,
          SkillId = skillId,
          SkillName = us.Skill!.Name
        })
        .FirstOrDefault();
    }

    public UserSkillReponseDto? AssignSkillToUser(string userId, int skillId)
    {
      var alreadyAssigned = _context.UserSkills
        .Any(us => us.UserId == userId && us.SkillId == skillId);

      if (alreadyAssigned) return null;

      var userSkill = new UserSkill
      {
        UserId = userId,
        SkillId = skillId
      };

      _context.UserSkills.Add(userSkill);

      _context.SaveChanges();

      var assignedSkill = _context.UserSkills
        .Include(us => us.Skill)
        .First(us => us.UserId == userId && us.SkillId == skillId);
      
      return new UserSkillReponseDto
      {
        UserId = assignedSkill.UserId,
        SkillId = assignedSkill.SkillId,
        SkillName = assignedSkill.Skill!.Name
      };
    }

    public void UnassignSkillFromUser(string userId, int skillId)
    {
      var userSkill = _context.UserSkills
        .FirstOrDefault(us => us.UserId == userId && us.SkillId == skillId);

      if (userSkill == null) return;
      _context.UserSkills.Remove(userSkill);
      _context.SaveChanges();
    }
  }
}