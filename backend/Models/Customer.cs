using SQLite;

namespace BackendAPI.Models
{
    public class Customer : IIdentifiable
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        [Unique, NotNull]
        public string Email { get; set; } = string.Empty;

        public DateTime RegistrationDate { get; set; }

        public string PhoneNumber { get; set; } = string.Empty;

        // Foreign Key to Address
        [NotNull]
        public int AddressId { get; set; }
    }
}
