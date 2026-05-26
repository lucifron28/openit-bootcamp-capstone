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
    private readonly ISocialLinkService _socialLinksService;
    private readonly ISkillsService _skillsService;
    private readonly IGigPostsService _gigPostsService;
    private readonly IGigApplicationsService _gigApplicationsService;
    private readonly UserManager<AppUser> _userManager;

    // CONSTRUCTOR
    public MeController(
      IMeService meService,
      ISocialLinkService socialLinksService,
      ISkillsService skillsService,
      IGigPostsService gigPostsService,
      IGigApplicationsService gigApplicationsService,
      UserManager<AppUser> userManager
    )
    {
      _socialLinksService = socialLinksService;
      _meService = meService;
      _skillsService = skillsService;
      _gigPostsService = gigPostsService;
      _gigApplicationsService = gigApplicationsService;
      _userManager = userManager;
    }

    // ============= PROFILE =============

    // GET /api/me
    [HttpGet]
    public IActionResult GetCurrentUserProfile()
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);
      var user = _meService.GetCurrentUserProfile(userId);
      if (user == null) return NotFound();
      return Ok(user);
    }

    // ============= SOCIAL LINKS =============

    // GET /api/me/sociallinks
    [HttpGet("sociallinks")]
    public IActionResult GetAllSocialLinksOfUser()
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);
      var socialLinks = _socialLinksService.GetAllSocialLinksOfUser(userId);
      return Ok(socialLinks);
    }

    // POST /api/me/sociallinks
    [HttpPost("sociallinks")]
    public IActionResult CreateSocialLink(
      [FromBody] PostSocialLinkDto newSocialLink
    )
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);

      var existing = _socialLinksService.GetSocialLinkOfUserByName(userId, newSocialLink.Name);
      if (existing != null) return Conflict();

      var socialLinkReponse = _socialLinksService.CreateSocialLink(userId, newSocialLink);

      return CreatedAtAction(
        "GetSocialLinkById",
        "SocialLinks",
        new { socialLinkId = socialLinkReponse.Id },
        socialLinkReponse
      );
    }

    // DELETE /api/me/sociallinks/{socialLinkId}
    [HttpDelete("sociallinks/{socialLinkId:int}")]
    public IActionResult DeleteSocialLinkOfUser(
      int socialLinkId
    )
    {
      var socialLink = _socialLinksService.GetSocialLinkById(socialLinkId);
      if (socialLink == null) return NotFound();

      int userId = int.Parse(_userManager.GetUserId(User)!);
      _socialLinksService.DeleteSocialLinkOfUserById(userId, socialLinkId);
      return NoContent();
    }

    // ============= SKILLS =============

    // GET /api/me/skills
    [HttpGet("skills")]
    public IActionResult GetAssignedSkillsForUser()
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);
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

      int userId = int.Parse(_userManager.GetUserId(User)!);

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

      int userId = int.Parse(_userManager.GetUserId(User)!);

      var assigned = _skillsService.GetAssignedSkillForUserById(userId, skillId);
      if (assigned == null) return NotFound();

      _skillsService.UnassignSkillFromUser(userId, skillId);
      return NoContent();
    }

    // ============= GIG PoSTS =============
    [HttpGet("gigposts")]
    public IActionResult GetGigPostsOfUser()
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);
      var gigPosts = _gigPostsService.GetAllGigPostsOfUser(userId);
      return Ok(gigPosts);
    }

    // ============= GIG APPLICATIONS =============

    // GET /api/me/gigapplications
    [HttpGet("gigapplications")]
    public IActionResult GetGigApplicationsOfUser()
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);
      var gigApplications = _gigApplicationsService.GetAllGigApplicationsOfUser(userId);
      return Ok(gigApplications);
    }
  }
}
