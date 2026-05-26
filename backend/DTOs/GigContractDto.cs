using SideKick.Server.Enums;

namespace SideKick.Server.DTOs
{
  public class GigContractResponseDto
  {
    public required int Id { get; set; }
    public required int PostId { get; set; }
    public required int ApplicationId { get; set; }
    public required int ClientId { get; set; }
    public required int FreelancerId { get; set; }
    public required ContractStatus Status { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
  }
}
