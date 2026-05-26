using SideKick.Server.Data;
using SideKick.Server.DTOs;

namespace SideKick.Server.Services
{
  public class MeService : IMeService
  {
    private readonly AppDbContext _context;

    public MeService(AppDbContext context)
    {
      _context = context;
    }

    public MeResponseDto? GetCurrentUserProfile(int userId)
    {
      return _context.Users
        .Where(u => u.Id == userId)
        .Select(u => new MeResponseDto
          {
            FirstName = u.FirstName,
            LastName = u.LastName,
            Username = u.UserName,
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            CreatedAt = u.CreatedAt
          }
        )
        .FirstOrDefault();
    }
  }
}
