using SQLite;

namespace BackendAPI.Models
{
    public class Invoice : IIdentifiable
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        public DateTime Date { get; set; }
        [NotNull]
        public decimal TotalAmount { get; set; }

        // Foreign key to Customer
        public int CustomerId { get; set; }
    }
}
