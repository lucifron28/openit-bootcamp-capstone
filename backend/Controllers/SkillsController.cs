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
  }
}
