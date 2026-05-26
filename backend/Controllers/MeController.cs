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
  public class MeController : ControllerBase
  {
    // SERVICE
    private readonly IMeService _meService;
    private readonly ISkillsService _skillsService;
    private readonly UserManager<AppUser> _userManager;

    // CONSTRUCTOR
    public MeController(
      IMeService meService,
      ISkillsService skillsService,
      UserManager<AppUser> userManager
    )
    {
      _meService = meService;
      _skillsService = skillsService;
      _userManager = userManager;
    }

    // GET /api/me
    [HttpGet]
    public IActionResult GetCurrentUserProfile()
    {
      var userId = _userManager.GetUserId(User)!;
      var user = _meService.GetCurrentUserProfile(userId);
      if (user == null) return NotFound();
      return Ok(user);
    }

    // GET /api/me/skills
    [HttpGet("skills")]
    public IActionResult GetAssignedSkillsForUser()
    {
      var userId = _userManager.GetUserId(User)!;
      var assignedSkills = _skillsService.GetAssignedSkillsForUser(userId);
      return Ok(assignedSkills);
    }

    // POST /api/me/skills
    [HttpPost("skills")]
    public IActionResult AssignSkillToUser(
      [FromBody] PostUserSkillDto newUserSkill
    )
    {
      var skillId = newUserSkill.SkillId;
      var skill = _skillsService.GetSkillById(skillId);
      if (skill == null) return NotFound();

      string userId = _userManager.GetUserId(User)!;

      var alreadyAssigned = _skillsService.GetAssignedSkillForUserById(userId, skillId);
      if (alreadyAssigned != null) return Conflict();

      var userSkillReponse = _skillsService.AssignSkillToUser(userId, skillId);

      return CreatedAtAction(
        "GetSkillById",
        "Skills",
        new { skillId = skillId },
        userSkillReponse
      );
    }

    // DELETE /api/me/skills/{skillId}
    [HttpDelete("skills/{skillId:int}")]
    public IActionResult UnassignSkillFromUser(
      int skillId
    )
    {
      var skill = _skillsService.GetSkillById(skillId);
      if (skill == null) return NotFound();

      string userId = _userManager.GetUserId(User)!;

      var assigned = _skillsService.GetAssignedSkillForUserById(userId, skillId);
      if (assigned == null) return NotFound();

      _skillsService.UnassignSkillFromUser(userId, skillId);
      return NoContent();
    }
  }
}