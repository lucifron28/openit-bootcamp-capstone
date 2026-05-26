using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SideKick.Server.Services;

namespace SideKick.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class SocialLinksController : ControllerBase
  {
    // SERVICE
    private readonly ISocialLinkService _socialLinksService;

    // CONSTRUCTOR
    public SocialLinksController(
      ISocialLinkService socialLinksService
    )
    {
      _socialLinksService = socialLinksService;
    }

    // GET /api/sociallinks
    [HttpGet]
    public IActionResult GetAllSocialLinks()
    {
      var allSocialLinks = _socialLinksService.GetAllSocialLinks();
      return Ok(allSocialLinks);
    }

    // GET /api/sociallinks/{socialLinkId}
    [HttpGet("{socialLinkId:int}")]
    public IActionResult GetSocialLinkById(
      int socialLinkId
    )
    {
      var socialLink = _socialLinksService.GetSocialLinkById(socialLinkId);
      if (socialLink == null) return NotFound();
      return Ok(socialLink);
    }
  }
}
