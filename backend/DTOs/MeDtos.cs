namespace SideKick.Server.DTOs
{
  public class MeResponseDto
  {
    public required int Id { get; set; }
    
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}