using SQLite;

namespace BackendAPI.Models
{
    public class InvoiceItem : IIdentifiable
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        // Foreign key to Product
        public int ProductId { get; set; }

        // Foreign key to Invoice
        public int InvoiceId { get; set; }
    }
}
