using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SideKick.Server.Enums;
using SideKick.Server.Models;
using SideKick.Server.Services;

namespace SideKick.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class GigContractsController : ControllerBase
  {
    // SERVICE
    private readonly IGigPostsService _gigPostsService;
    private readonly IGigApplicationsService _gigApplicationsService;
    private readonly IGigContractsService _gigContractsService;
    private readonly UserManager<AppUser> _userManager;

    // CONSTRUCTOR
    public GigContractsController(
      IGigPostsService gigPostsService,
      IGigApplicationsService gigApplicationsService,
      IGigContractsService gigContractsService,
      UserManager<AppUser> userManager
    )
    {
      _gigPostsService = gigPostsService;
      _gigApplicationsService = gigApplicationsService;
      _gigContractsService = gigContractsService;
      _userManager = userManager;
    }

    // GET /api/gigcontracts
    [HttpGet]
    public IActionResult GetAllGigContracts()
    {
      var allGigContracts = _gigContractsService.GetAllGigContracts();
      return Ok(allGigContracts);
    }

    // GET /api/gigcontracts/{gigContractId}
    [HttpGet("{gigContractId:int}")]
    public IActionResult GetGigContractById(
      int gigContractId
    )
    {
      var gigContract = _gigContractsService.GetGigContractById(gigContractId);
      if (gigContract == null) return NotFound();
      return Ok(gigContract);
    }

    // DELETE /api/gigcontracts/{gigContractId}
    [HttpDelete("{gigContractId:int}")]
    public IActionResult DeleteGigContractById(
      int gigContractId
    )
    {
      var gigContract = _gigContractsService.GetGigContractById(gigContractId);
      if (gigContract == null) return NotFound();

      _gigContractsService.DeleteGigContractById(gigContractId);

      if (gigContract.Status == ContractStatus.COMPLETED) return Forbid();

      if (gigContract.Status == ContractStatus.CANCELLED) return Conflict();

      _gigContractsService.UpdateGigContractStatus(gigContractId, ContractStatus.CANCELLED);

      return NoContent();
    }

    // POST /api/gigcontracts/{gigContractId}/accept
    [HttpPost("{gigContractId:int}/accept")]
    public IActionResult AcceptGigContract(
      int gigContractId
    )
    {
      var gigContract = _gigContractsService.GetGigContractById(gigContractId);
      if (gigContract == null) return NotFound();

      int userId = int.Parse(_userManager.GetUserId(User)!);

      if (userId == gigContract.ClientId) return Forbid();

      _gigContractsService.UpdateGigContractStatus(gigContractId, ContractStatus.ACTIVE);

      if (
        gigContract.Status == ContractStatus.COMPLETED || 
        gigContract.Status == ContractStatus.CANCELLED
      ) return Forbid();

      if (gigContract.Status == ContractStatus.ACTIVE) return Conflict();

      _gigPostsService.UpdateGigPostStatus(gigContract.PostId, PostStatus.IN_PROGRESS);

      var acceptedContract = _gigContractsService.GetGigContractById(gigContractId);

      return Ok(acceptedContract);
    }
  }
}
