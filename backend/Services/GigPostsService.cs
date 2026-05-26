using Microsoft.EntityFrameworkCore;
using SideKick.Server.Data;
using SideKick.Server.DTOs;
using SideKick.Server.Enums;
using SideKick.Server.Models;

namespace SideKick.Server.Services
{
  public class GigPostsService : IGigPostsService 
  {
    private readonly AppDbContext _context;

    public GigPostsService(AppDbContext context)
    {
      _context = context;
    }

    public List<GigPostResponseDto> GetAllGigPosts()
    {
      return _context.GigPosts
        .Include(gp => gp.User)
        .Select(gp => new GigPostResponseDto
        {
          Id = gp.Id,
          Title = gp.Title,
          Description = gp.Description,
          Status = gp.Status,
          CreatedAt = gp.CreatedAt,
          UserId = gp.User!.Id,
          Username = gp.User.UserName,
          FirstName = gp.User.FirstName,
          LastName = gp.User.LastName
        })
        .ToList();
    }

    public List<GigPostResponseDto> GetAllGigPostsOfUser(int userId)
    {
      return _context.GigPosts
        .Where(gp => gp.UserId == userId)
        .Include(gp => gp.User)
        .Select(gp => new GigPostResponseDto
        {
          Id = gp.Id,
          Title = gp.Title,
          Description = gp.Description,
          Status = gp.Status,
          CreatedAt = gp.CreatedAt,
          UserId = gp.User!.Id,
          Username = gp.User.UserName,
          FirstName = gp.User.FirstName,
          LastName = gp.User.LastName
        })
        .ToList();
    }

    public GigPostResponseDto CreateGigPost(int userId, PostGigPostDto newGigPost)
    {
      var gigPost = new GigPost
      {
        UserId = userId,
        Title = newGigPost.Title,
        Description = newGigPost.Description
      };

      _context.GigPosts.Add(gigPost);

      _context.SaveChanges();

      var createdPost = _context.GigPosts
        .Include(gp => gp.User)
        .First(gp => gp.Id == gigPost.Id);

      return new GigPostResponseDto
      {
        Id = createdPost.Id,
        Title = createdPost.Title,
        Description = createdPost.Description,
        Status = createdPost.Status,
        CreatedAt = createdPost.CreatedAt,
        UserId = userId,
        FirstName = createdPost.User!.FirstName,
        LastName = createdPost.User.LastName
      };
    }

    public GigPostResponseDto? GetGigPostById(int gigPostId)
    {
      return _context.GigPosts
        .Where(gp => gp.Id == gigPostId)
        .Include(gp => gp.User)
        .Select(gp => new GigPostResponseDto
          {
            Id = gp.Id,
            Title = gp.Title,
            Description = gp.Description,
            Status = gp.Status,
            CreatedAt = gp.CreatedAt,
            UserId = gp.User!.Id,
            FirstName = gp.User.FirstName,
            LastName = gp.User.LastName
          }
        )
        .FirstOrDefault();
    }

    public GigPostResponseDto? EditGigPostById(int gigPostId, PatchGigPostDto editedGigPost)
    {
      var gigPost = _context.GigPosts
        .Include(gp => gp.User)
        .FirstOrDefault(gp => gp.Id == gigPostId);

      if (gigPost == null) return null;

      if (!string.IsNullOrEmpty(editedGigPost.Title))
      {
        gigPost.Title = editedGigPost.Title;
      }
      
      if (!string.IsNullOrEmpty(editedGigPost.Description))
      {
        gigPost.Description = editedGigPost.Description;
      }

      _context.SaveChanges();

      return new GigPostResponseDto
      {
        Id = gigPost.Id,
        Title = gigPost.Title,
        Description = gigPost.Description,
        Status = gigPost.Status,
        CreatedAt = gigPost.CreatedAt,
        UserId = gigPost.User!.Id,
        FirstName = gigPost.User.FirstName,
        LastName = gigPost.User.LastName
      };
    }

    public void DeleteGigPostById(int gigPostId)
    {
      var gigPost = _context.GigPosts.FirstOrDefault(gp => gp.Id == gigPostId);
      if (gigPost == null) return;
      _context.Remove(gigPost);
      _context.SaveChanges();
    }

    public void UpdateGigPostStatus(
      int gigPostId,
      PostStatus status
    )
    {
      var gigPost = _context.GigPosts.FirstOrDefault(gp => gp.Id == gigPostId);
      if (gigPost == null) return;
      gigPost.Status = status;
      _context.SaveChanges();
    }
  }
}
