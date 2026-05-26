namespace SideKick.Server.DTOs
{
  public class SocialLinkReponseDto
  {
    public required int Id { get; set; }
    
    public required string Name { get; set; }

    public required string Href { get; set; }
  }

  public class PostSocialLinkDto
  {
    public required string Name { get; set; }

    public required string Href { get; set; }
  }
}