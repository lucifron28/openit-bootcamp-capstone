using SideKick.Server.Data;
using SideKick.Server.DTOs;
using SideKick.Server.Models;

namespace SideKick.Server.Services
{
  public class SocialLinkService : ISocialLinkService
  {
    private readonly AppDbContext _context;

    public SocialLinkService(AppDbContext context)
    {
      _context = context;
    }

    public List<SocialLinkReponseDto> GetAllSocialLinks()
    {
      return _context.SocialLinks
        .Select(sl => new SocialLinkReponseDto
        {
          Id = sl.Id,
          Name = sl.Name,
          Href = sl.Href
        })
        .ToList();
    }

    public List<SocialLinkReponseDto> GetAllSocialLinksOfUser(int userId)
    {
      return _context.SocialLinks
        .Where(sl => sl.UserId == userId)
        .Select(sl => new SocialLinkReponseDto
        {
          Id = sl.Id,
          Name = sl.Name,
          Href = sl.Href
        })
        .ToList();
    }

    public SocialLinkReponseDto CreateSocialLink(int userId, PostSocialLinkDto newSocialLink)
    {
      var socialLink = new SocialLink
      {
        Name = newSocialLink.Name,
        Href = newSocialLink.Href,
        UserId = userId
      };

      _context.SocialLinks.Add(socialLink);
      _context.SaveChanges();

      var createdSocialLink = _context.SocialLinks
        .First(sl => sl.Id == socialLink.Id);

      return new SocialLinkReponseDto
      {
        Id = createdSocialLink.Id,
        Name = createdSocialLink.Name,
        Href = createdSocialLink.Href
      };
    }

    public SocialLinkReponseDto? GetSocialLinkById(int socialLinkId)
    {
      return _context.SocialLinks
        .Where(sl => sl.Id == socialLinkId)
        .Select(sl => new SocialLinkReponseDto
        {
          Id = sl.Id,
          Name = sl.Name,
          Href = sl.Href
        })
        .FirstOrDefault();
    }

    public SocialLinkReponseDto? GetSocialLinkOfUserByName(int userId, string socialLinkName)
    {
      return _context.SocialLinks
        .Where(sl => sl.Name == socialLinkName && sl.UserId == userId)
        .Select(sl => new SocialLinkReponseDto
        {
          Id = sl.Id,
          Name = sl.Name,
          Href = sl.Href
        })
        .FirstOrDefault();
    }

    public void DeleteSocialLinkOfUserById(int userId, int socialLinkId)
    {
      var socialLink = _context.SocialLinks
        .FirstOrDefault(sl => sl.Id == socialLinkId && sl.UserId == userId);

      if (socialLink == null) return;

      _context.SocialLinks.Remove(socialLink);
      _context.SaveChanges();
    }
  }
}