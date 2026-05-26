using SideKick.Server.DTOs;
using SideKick.Server.Enums;

namespace SideKick.Server.Services
{
  public interface IGigPostsService
  {
    public List<GigPostResponseDto> GetAllGigPosts();
    public List<GigPostResponseDto> GetAllGigPostsOfUser(int userId);
    public GigPostResponseDto CreateGigPost(int userId, PostGigPostDto gigPost);
    public GigPostResponseDto? GetGigPostById(int gigPostId);
    public GigPostResponseDto? EditGigPostById(int gigPostId, PatchGigPostDto gigPost);
    public void DeleteGigPostById(int gigPostId);
    public void UpdateGigPostStatus(int gigPostId, PostStatus status);
  }
}
