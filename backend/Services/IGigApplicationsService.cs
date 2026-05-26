using SideKick.Server.DTOs;

namespace SideKick.Server.Services
{
  public interface IGigApplicationsService
  {
    public List<GigApplicationResponseDto> GetAllGigApplications();
    public List<GigApplicationResponseDto> GetAllGigApplicationsOfUser(int userId);
    public List<GigApplicationResponseDto> GetAllGigApplicationsOfPost(int userId);
    public GigApplicationResponseDto CreateGigApplication(int userId, int gigPostId);
    public GigApplicationResponseDto? GetGigApplicationById(int gigApplicationId);
    public GigApplicationResponseDto? GetGigApplicationByUserIAndPostId(int userId, int gigPostId);
    public void DeleteGigApplicationById(int gigApplicationId);
  }
}
