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
  public class GigPostsController : ControllerBase
  {
    // SERVICE
    private readonly IGigPostsService _gigPostsService;
    private readonly UserManager<AppUser> _userManager;

    // CONSTRUCTOR
    public GigPostsController(
      IGigPostsService gigPostsService,
      UserManager<AppUser> userManager
    )
    {
      _gigPostsService = gigPostsService;
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
  }
}
