using Microsoft.EntityFrameworkCore;
using SideKick.Server.Enums;

namespace SideKick.Server.Models
{
    public class Transaction
    {
        public int Id { get; set; }

        [Precision(18, 2)]
        public decimal AmountPaid { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now.ToUniversalTime();

        public List<GigPayment> GigPayments { get; set; } = [];
    }
}
