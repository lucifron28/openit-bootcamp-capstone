using SideKick.Server.DTOs;

namespace SideKick.Server.Services
{
  public interface IMeService
  {
    public MeResponseDto? GetCurrentUserProfile(int userId);
  }
}
