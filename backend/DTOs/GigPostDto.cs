namespace SideKick.Server.DTOs
{
  public class GigPostResponseDto
  {
    public required int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public required int UserId { get; set; }
    public string? Username { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
  }

  public class PostGigPostDto
  {
    public required string Title { get; set; }
    public required string Description { get; set; }
  }

  public class PatchGigPostDto
  {
    public string? Title { get; set; }
    public string? Description { get; set; }
  }
}
