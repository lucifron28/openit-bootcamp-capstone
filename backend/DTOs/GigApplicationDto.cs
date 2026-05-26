namespace SideKick.Server.DTOs
{
  public class GigApplicationResponseDto
  {
    public required int Id { get; set; }
    public required int UserId { get; set; }
    public required int PostId { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public string? Username { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
  }

  public class PostGigApplicationDto
  {
    public required int UserId { get; set; }
    public required int PostId { get; set; }
  }
}
