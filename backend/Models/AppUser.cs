using Microsoft.AspNetCore.Identity;

namespace GigApp.Server.Models
{
  public class AppUser : IdentityUser
  {
    public string FirstName { get; set; } = string.Empty;
    
    public string LastName { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();

    public int UserSkillId { get; set; }

    public UserSkill? UserSkill { get; set; }
  }
}