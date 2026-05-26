using System.Net.NetworkInformation;
using Microsoft.EntityFrameworkCore;
using SideKick.Server.Data;
using SideKick.Server.DTOs;
using SideKick.Server.Enums;
using SideKick.Server.Models;

namespace SideKick.Server.Services
{
  public class GigContractsService : IGigContractsService
  {
    private readonly AppDbContext _context;

    public GigContractsService(AppDbContext context)
    {
      _context = context;
    }

    public List<GigContractResponseDto> GetAllGigContracts()
    {
      return _context.GigContracts
        .Include(gc => gc.Post)
        .Include(gc => gc.Application)
        .Select(gc => new GigContractResponseDto
        {
          Id = gc.Id,
          PostId = gc.PostId,
          ApplicationId = gc.ApplicationId,
          ClientId = gc.Post!.UserId,
          FreelancerId = gc.Application!.UserId,
          Status = gc.Status,
          CreatedAt = gc.CreatedAt
        })
        .ToList();
    }

    public List<GigContractResponseDto> GetAllGigContractsOfClient(int userId)
    {
      return _context.GigContracts
        .Where(gc => gc.Post!.UserId == userId)
        .Include(gc => gc.Post)
        .Include(gc => gc.Application)
        .Select(gc => new GigContractResponseDto
        {
          Id = gc.Id,
          PostId = gc.PostId,
          ApplicationId = gc.ApplicationId,
          ClientId = gc.Post!.UserId,
          FreelancerId = gc.Application!.UserId,
          Status = gc.Status,
          CreatedAt = gc.CreatedAt
        })
        .ToList();
    }

    public List<GigContractResponseDto> GetAllGigContractsOfFreelancer(int userId)
    {
      return _context.GigContracts
        .Where(gc => gc.Application!.UserId == userId)
        .Include(gc => gc.Post)
        .Include(gc => gc.Application)
        .Select(gc => new GigContractResponseDto
        {
          Id = gc.Id,
          PostId = gc.PostId,
          ApplicationId = gc.ApplicationId,
          ClientId = gc.Post!.UserId,
          FreelancerId = gc.Application!.UserId,
          Status = gc.Status,
          CreatedAt = gc.CreatedAt
        })
        .ToList();
    }

    public GigContractResponseDto CreateGigContract(
      int applicationId
    )
    {
      var gigApplication = _context.GigApplications
        .Include(ga => ga.Post)
        .First(ga => ga.Id == applicationId);

      var gigContract = new GigContract
      {
        PostId = gigApplication.PostId,
        ApplicationId = applicationId
      };

      _context.GigContracts.Add(gigContract);

      _context.SaveChanges();

      var createdContract = _context.GigContracts
        .Include(gc => gc.Post)
        .Include(gc => gc.Application)
        .First(gc => gc.Id == gigContract.Id);

      return new GigContractResponseDto
      {
        Id = createdContract.Id,
        PostId = createdContract.PostId,
        ApplicationId = createdContract.ApplicationId,
        ClientId = createdContract.Post!.UserId,
        FreelancerId = createdContract.Application!.UserId,
        Status = createdContract.Status,
        CreatedAt = createdContract.CreatedAt
      };
    }

    public GigContractResponseDto? GetGigContractById(int gigContractId)
    {
      return _context.GigContracts
        .Where(gc => gc.Id == gigContractId)
        .Include(gc => gc.Post)
        .Include(gc => gc.Application)
        .Select(gc => new GigContractResponseDto
        {
          Id = gc.Id,
          PostId = gc.PostId,
          ApplicationId = gc.ApplicationId,
          ClientId = gc.Post!.UserId,
          FreelancerId = gc.Application!.UserId,
          Status = gc.Status,
          CreatedAt = gc.CreatedAt
        })
        .FirstOrDefault();
    }

    public GigContractResponseDto? GetGigContractByPostIdAndApplicationId(
      int postId,
      int applicationId
    )
    {
      return _context.GigContracts
        .Where(gc => gc.PostId == postId && gc.ApplicationId == applicationId)
        .Include(gc => gc.Post)
        .Include(gc => gc.Application)
        .Select(gc => new GigContractResponseDto
        {
          Id = gc.Id,
          PostId = gc.PostId,
          ApplicationId = gc.ApplicationId,
          ClientId = gc.Post!.UserId,
          FreelancerId = gc.Application!.UserId,
          Status = gc.Status,
          CreatedAt = gc.CreatedAt
        })
        .FirstOrDefault();
    }

    public void DeleteGigContractById(int gigContractId)
    {
      var gigContract = _context.GigContracts.FirstOrDefault(gc => gc.Id == gigContractId);
      if (gigContract == null) return;
      _context.SaveChanges();
    }

    public void UpdateGigContractStatus(
      int gigContractId,
      ContractStatus status
    )
    {
      var gigContract = _context.GigContracts.FirstOrDefault(gc => gc.Id == gigContractId);
      if (gigContract == null) return;
      gigContract.Status = status;
      _context.SaveChanges();
    }
  }
}
