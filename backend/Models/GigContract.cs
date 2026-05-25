using GigApp.Server.Enums;

namespace GigApp.Server.Models
{
  public class GigContract
  {
    public int Id { get; set; }

    public int PostId { get; set; }
    public GigPost? Posts { get; set; }

    public int ApplicationId { get; set; }
    public GigApplication? Applications { get; set; }

    public ContractStatus Status { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}