using SideKick.Server.DTOs;

namespace SideKick.Server.Services
{
  public interface ISocialLinkService
  {
    public List<SocialLinkReponseDto> GetAllSocialLinks();
    public List<SocialLinkReponseDto> GetAllSocialLinksOfUser(int userId);
    public SocialLinkReponseDto CreateSocialLink(int userId, PostSocialLinkDto socialLink);
    public SocialLinkReponseDto? GetSocialLinkById(int socialLinkId);
    public SocialLinkReponseDto? GetSocialLinkOfUserByName(int userId, string socialLinkName);
    public void DeleteSocialLinkOfUserById(int userId, int socialLinkId);
  }
}