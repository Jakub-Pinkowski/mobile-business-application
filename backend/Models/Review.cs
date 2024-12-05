using SQLite;

namespace BackendAPI.Models
{
    public class Review : IIdentifiable
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        public string Content { get; set; } = string.Empty;

        public int Rating { get; set; }

        // Foreign key to Product
        public int ProductId { get; set; }  

        // Foreign key to Customer
        public int CustomerId { get; set; }
    }
}
