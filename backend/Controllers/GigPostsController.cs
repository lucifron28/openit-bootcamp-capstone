using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SideKick.Server.DTOs;
using SideKick.Server.Enums;
using SideKick.Server.Models;
using SideKick.Server.Services;

namespace SideKick.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class GigPostsController : ControllerBase
  {
    // SERVICE
    private readonly IGigPostsService _gigPostsService;
    private readonly IGigApplicationsService _gigApplicationsService;
    private readonly UserManager<AppUser> _userManager;

    // CONSTRUCTOR
    public GigPostsController(
      IGigPostsService gigPostsService,
      IGigApplicationsService gigApplicationsService,
      UserManager<AppUser> userManager
    )
    {
      _gigPostsService = gigPostsService;
      _gigApplicationsService = gigApplicationsService;
      _userManager = userManager;
    }

    // GET /api/gigposts
    [HttpGet]
    public IActionResult GetAllGigPosts()
    {
      var allGigPosts = _gigPostsService.GetAllGigPosts();
      return Ok(allGigPosts);
    }

    // POST /api/gigposts
    [HttpPost]
    public IActionResult CreateGigPost(
      [FromBody] PostGigPostDto newGigPost
    )
    {
      int userId = int.Parse(_userManager.GetUserId(User)!);
      var gigPostResponse = _gigPostsService.CreateGigPost(userId, newGigPost);
      var gigPostId = gigPostResponse.Id;

      return CreatedAtAction(
        nameof(GetGigPostById),
        new { gigPostId = gigPostId },
        gigPostResponse
      );
    }

    // GET /api/gigposts/{gigPostId}
    [HttpGet("{gigPostId:int}")]
    public IActionResult GetGigPostById(
      int gigPostId
    )
    {
      var gigPost = _gigPostsService.GetGigPostById(gigPostId);
      if (gigPost == null) return NotFound();
      return Ok(gigPost);
    }

    // PATCH /api/gigposts/{gigPostId}
    [HttpPatch("{gigPostId:int}")]
    public IActionResult EditGigPostById(
      int gigPostId,
      [FromBody] PatchGigPostDto editedGigPost
    )
    {
      var gigPost = _gigPostsService.GetGigPostById(gigPostId);
      if (gigPost == null) return NotFound();
      var gigPostResponse = _gigPostsService.EditGigPostById(gigPostId, editedGigPost);
      return Ok(gigPostResponse);
    }

    // DELETE /api/gigposts/{gigPostId}
    [HttpDelete("{gigPostId:int}")]
    public IActionResult DeleteGigPostById(
      int gigPostId
    )
    {
      var gigPost = _gigPostsService.GetGigPostById(gigPostId);
      if (gigPost == null) return NotFound();
      _gigPostsService.DeleteGigPostById(gigPostId);
      return NoContent();
    }

    // GET /api/gigposts/{gigPostId}/applications
    [HttpGet("{gigPostId:int}/applications")]
    public IActionResult GetAllGigApplicationsOfPost(
      int gigPostId
    )
    {
      var gigApplications = _gigApplicationsService.GetAllGigApplicationsOfPost(gigPostId);
      return Ok(gigApplications);
    }

    // POST /api/gigposts/{gigPostId}/applications
    [HttpPost("{gigPostId:int}/applications")]
    public IActionResult CreateGigApplicationOnPost(
      int gigPostId
    )
    {
      var gigPost = _gigPostsService.GetGigPostById(gigPostId);
      if (gigPost == null) return NotFound();
      if (gigPost.Status != PostStatus.OPEN) return Forbid();

      int userId = int.Parse(_userManager.GetUserId(User)!);
      
      var existing = _gigApplicationsService.GetGigApplicationByUserIAndPostId(userId, gigPostId);
      if (existing != null) return Conflict();

      var gigApplicationResponse = _gigApplicationsService.CreateGigApplication(userId, gigPostId);
      var gigApplicationId = gigApplicationResponse.Id;

      return CreatedAtAction(
        "GetGigApplicationById",
        "GigApplications",
        new { gigApplicationId = gigApplicationId },
        gigApplicationResponse
      );
    }
  }
}
