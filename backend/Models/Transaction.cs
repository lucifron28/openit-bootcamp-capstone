using GigApp.Server.Enums;

namespace GigApp.Server.Models
{
  public class Transaction
  {
    public int Id { get; set; }

    public double AmountPaid { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();
  }
}