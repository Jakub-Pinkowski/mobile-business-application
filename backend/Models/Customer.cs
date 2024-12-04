using SQLite;

namespace BackendAPI.Models
{
    public class Customer
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // Foreign key to Address
        public int AddressId { get; set; }  

        // Foreign key to Invoice
        public int InvoiceId { get; set; }
    }
}
