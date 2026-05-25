namespace GigApp.Server.Models
{
  public class GigPayment
  {
    public int Id { get; set; }

    public int ContractId { get; set; }

    public int TransactionId { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}