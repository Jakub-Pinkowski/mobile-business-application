using SQLite;

namespace BackendAPI.Models
{
    public class ProductSupplier : IIdentifiable
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        // Foreign key to Product
        public int ProductId { get; set; }

        // Foreign key to Supplier
        public int SupplierId { get; set; }
    }
}
