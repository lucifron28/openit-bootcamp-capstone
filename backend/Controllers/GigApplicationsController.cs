using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SideKick.Server.Models;
using SideKick.Server.Services;

namespace SideKick.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class GigApplicationsController : ControllerBase
  {
    // SERVICE
    private readonly IGigApplicationsService _gigApplicationsService;
    private readonly UserManager<AppUser> _userManager;

    // CONSTRUCTOR
    public GigApplicationsController(
      IGigApplicationsService gigApplicationsService,
      UserManager<AppUser> userManager
    )
    {
      _gigApplicationsService = gigApplicationsService;
      _userManager = userManager;
    }

    // GET /api/gigapplications
    [HttpGet]
    public IActionResult GetAllGigApplications()
    {
      var allGigApplications = _gigApplicationsService.GetAllGigApplications();
      return Ok(allGigApplications);
    }

    // GET /api/gigapplications/{gigApplicationId}
    [HttpGet("{gigApplicationId:int}")]
    public IActionResult GetGigApplicationById(
      int gigApplicationId
    )
    {
      var gigApplication = _gigApplicationsService.GetGigApplicationById(gigApplicationId);
      if (gigApplication == null) return NotFound();
      return Ok(gigApplication);
    }

    // DELETE /api/gigapplications/{gigApplicationId}
    [HttpDelete("{gigApplicationId:int}")]
    public IActionResult DeleteGigApplicationById(
      int gigApplicationId
    )
    {
      var gigApplication = _gigApplicationsService.GetGigApplicationById(gigApplicationId);
      if (gigApplication == null) return NotFound();
      _gigApplicationsService.DeleteGigApplicationById(gigApplicationId);
      return NoContent();
    }
  }
}