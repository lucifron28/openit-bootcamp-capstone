namespace SideKick.Server.Models
{
  public class GigPayment
  {
    public int Id { get; set; }

    public required int ContractId { get; set; }

    public GigContract? Contract { get; set; }

    public required int TransactionId { get; set; }

    public Transaction? Transaction { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}