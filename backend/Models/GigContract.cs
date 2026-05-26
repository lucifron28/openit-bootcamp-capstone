using SideKick.Server.Enums;

namespace SideKick.Server.Models
{
  public class GigContract
  {
    public int Id { get; set; }

    public required int PostId { get; set; }

    public GigPost? Post { get; set; }

    public required int ApplicationId { get; set; }

    public GigApplication? Application { get; set; }

    public ContractStatus Status { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}