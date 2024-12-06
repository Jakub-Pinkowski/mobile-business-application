using SQLite;

namespace BackendAPI.Models
{
    public class ProductTag : IIdentifiable
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        // Foreign key to Product
        public int ProductId { get; set; }

        // Foreign key to Tag
        public int TagId { get; set; }
    }
}
