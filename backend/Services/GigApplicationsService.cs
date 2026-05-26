using Microsoft.EntityFrameworkCore;
using SideKick.Server.Data;
using SideKick.Server.DTOs;
using SideKick.Server.Enums;
using SideKick.Server.Models;

namespace SideKick.Server.Services
{
  public class GigApplicationsService : IGigApplicationsService
  {
    private readonly AppDbContext _context;

    public GigApplicationsService(AppDbContext context)
    {
      _context = context;
    }

    public List<GigApplicationResponseDto> GetAllGigApplications()
    {
      return _context.GigApplications
        .Select(ga => new GigApplicationResponseDto
        {
          Id = ga.Id,
          UserId = ga.User!.Id,
          PostId = ga.PostId,
          CreatedAt = ga.CreatedAt,
          Username = ga.User.UserName,
          FirstName = ga.User.FirstName,
          LastName = ga.User.LastName
        })
        .ToList();
    }

    public List<GigApplicationResponseDto> GetAllGigApplicationsOfUser(
      int userId
    )
    {
      return _context.GigApplications
        .Where(ga => ga.UserId == userId)
        .Select(ga => new GigApplicationResponseDto
        {
          Id = ga.Id,
          UserId = ga.User!.Id,
          PostId = ga.PostId,
          CreatedAt = ga.CreatedAt,
          Username = ga.User.UserName,
          FirstName = ga.User.FirstName,
          LastName = ga.User.LastName
        })
        .ToList();
    }

    public List<GigApplicationResponseDto> GetAllGigApplicationsOfPost(
      int postId
    )
    {
      return _context.GigApplications
        .Where(ga => ga.PostId == postId)
        .Select(ga => new GigApplicationResponseDto
        {
          Id = ga.Id,
          UserId = ga.User!.Id,
          PostId = ga.PostId,
          CreatedAt = ga.CreatedAt,
          Username = ga.User.UserName,
          FirstName = ga.User.FirstName,
          LastName = ga.User.LastName
        })
        .ToList();
    }

    public GigApplicationResponseDto CreateGigApplication(
      int userId,
      int postId
    )
    {
      var gigApplication = new GigApplication
      {
        UserId = userId,
        PostId = postId,
      };

      _context.GigApplications.Add(gigApplication);

      _context.SaveChanges();

      var createdApplication = _context.GigApplications
        .Include(ga => ga.User)
        .First(ga => ga.Id == gigApplication.Id);

      return new GigApplicationResponseDto
      {
        Id = createdApplication.Id,
        UserId = createdApplication.User!.Id,
        PostId = createdApplication.PostId,
        CreatedAt = createdApplication.CreatedAt,
        Username = createdApplication.User.UserName,
        FirstName = createdApplication.User.FirstName,
        LastName = createdApplication.User.LastName
      };
    }

    public GigApplicationResponseDto? GetGigApplicationById(
      int gigApplicationId
    )
    {
      return _context.GigApplications
        .Where(ga => ga.Id == gigApplicationId)
        .Include(ga => ga.User)
        .Select(ga => new GigApplicationResponseDto
          {
            Id = ga.Id,
            UserId = ga.User!.Id,
            PostId = ga.PostId,
            CreatedAt = ga.CreatedAt,
            Username = ga.User.UserName,
            FirstName = ga.User.FirstName,
            LastName = ga.User.LastName
          }
        )
        .FirstOrDefault();
    }

    public GigApplicationResponseDto? GetGigApplicationByUserIAndPostId(int userId, int gigPostId)
    {
      return _context.GigApplications
        .Where(ga => ga.UserId == userId && ga.PostId == gigPostId)
        .Include(ga => ga.User)
        .Select(ga => new GigApplicationResponseDto
          {
            Id = ga.Id,
            UserId = ga.User!.Id,
            PostId = ga.PostId,
            CreatedAt = ga.CreatedAt,
            Username = ga.User.UserName,
            FirstName = ga.User.FirstName,
            LastName = ga.User.LastName
          }
        )
        .FirstOrDefault();
    }

    public void DeleteGigApplicationById(
      int gigApplicationId
    )
    {
      var gigApplication = _context.GigApplications
        .FirstOrDefault(ga => ga.Id == gigApplicationId);
      if (gigApplication == null) return;
      _context.GigApplications.Remove(gigApplication);
      _context.SaveChanges();
    }
  }
}
