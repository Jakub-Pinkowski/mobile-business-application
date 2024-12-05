using SQLite;

namespace BackendAPI.Models
{
    public class Product : IIdentifiable
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        [NotNull]
        public decimal Price { get; set; }

        public string Description { get; set; } = string.Empty;

        // Foreign key to Category
        public int CategoryId { get; set; }

        // Foreign key to Supplier
        public int SupplierId { get; set; }
    }
}
