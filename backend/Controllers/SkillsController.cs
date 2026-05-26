using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SideKick.Server.DTOs;
using SideKick.Server.Models;
using SideKick.Server.Services;

namespace SideKick.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class SkillsController : ControllerBase
  {
    // SERVICE
    private readonly ISkillsService _skillsService;
    private readonly UserManager<AppUser> _userManager;

    // CONSTRUCTOR
    public SkillsController(
      ISkillsService skillsService,
      UserManager<AppUser> userManager
    )
    {
      _skillsService = skillsService;
      _userManager = userManager;
    }

    // GET /api/skills
    [HttpGet]
    public IActionResult GetAllGigPosts()
    {
      var allSkills = _skillsService.GetAllSkills();
      return Ok(allSkills);
    }

    // POST /api/skills
    [HttpPost]
    public IActionResult CreateGigPost(
      [FromBody] PostSkillDto newSkill
    )
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);
      var skillResponse = _skillsService.CreateSkill(userId, newSkill);
      var skillId = skillResponse.Id;

      return CreatedAtAction(
        nameof(GetSkillById),
        new { skillId = skillId },
        skillResponse
      );
    }

    // GET /api/skills/{skillId}
    [HttpGet("{skillId:int}")]
    public IActionResult GetSkillById(
      int skillId
    )
    {
      var skill = _skillsService.GetSkillById(skillId);
      if (skill == null) return NotFound();
      return Ok(skill);
    }

    // DELETE /api/skills/{skillId}
    [HttpDelete("{skillId:int}")]
    public IActionResult DeleteSkillById(
      int skillId
    )
    {
      var skill = _skillsService.GetSkillById(skillId);
      if (skill == null) return NotFound();
      _skillsService.DeleteSkillById(skillId);
      return NoContent();
    }

    // GET /api/me/assignedskills
    [HttpGet("/assignedskills")]
    public IActionResult GetAssignedSkillsForUser()
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);
      var assignedSkills = _skillsService.GetAssignedSkillsForUser(userId);
      return Ok(assignedSkills);
    }

    // POST /api/me/assignedskills
    [HttpPost("/assignedskills")]
    public IActionResult AssignSkillToUser(
      [FromBody] PostUserSkillDto newUserSkill
    )
    {
      var skillId = newUserSkill.SkillId;
      var skill = _skillsService.GetSkillById(skillId);
      if (skill == null) return NotFound();

      int userId = int.Parse(_userManager.GetUserId(User)!);

      var alreadyAssigned = _skillsService.GetAssignedSkillForUserById(userId, skillId);
      if (alreadyAssigned != null) return Conflict();

      var userSkillReponse = _skillsService.AssignSkillToUser(userId, skillId);

      return CreatedAtAction(
        nameof(GetSkillById),
        new { skillId = skillId },
        userSkillReponse
      );
    }

    // DELETE /api/me/assignedskills/{skillId}
    [HttpDelete("/assignedskills/{skillId:int}")]
    public IActionResult UnassignSkillFromUser(
      int skillId
    )
    {
      var skill = _skillsService.GetSkillById(skillId);
      if (skill == null) return NotFound();

      int userId = int.Parse(_userManager.GetUserId(User)!);

      var assigned = _skillsService.GetAssignedSkillForUserById(userId, skillId);
      if (assigned == null) return NotFound();

      _skillsService.UnassignSkillFromUser(userId, skillId);
      return NoContent();
    }
  }
}
