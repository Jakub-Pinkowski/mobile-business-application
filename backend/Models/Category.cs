using SQLite;

namespace BackendAPI.Models
{
    public class Category : IIdentifiable
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        // One-to-many relationship with Products (managed via foreign key in Product model)
    }
}
