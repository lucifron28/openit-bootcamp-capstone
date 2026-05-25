namespace SideKick.Server.Models
{
  public class GigPayment
  {
    public int Id { get; set; }

    public int ContractId { get; set; }

    public GigContract? Contract { get; set; }

    public int TransactionId { get; set; }

    public Transaction? Transaction { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}