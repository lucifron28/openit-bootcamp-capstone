using SideKick.Server.DTOs;

namespace SideKick.Server.Services
{
  public interface IGigPostsService
  {
    public List<GigPostResponseDto> GetAllGigPosts();
    public GigPostResponseDto CreateGigPost(string userId, PostGigPostDto gigPost);
    public GigPostResponseDto? GetGigPostById(int gigPostId);
    public GigPostResponseDto? EditGigPostById(int gigPostId, PatchGigPostDto gigPost);
    public void DeleteGigPostById(int gigPostId);
  }
}