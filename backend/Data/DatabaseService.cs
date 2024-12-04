using SQLite;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackendAPI.Models; // This will reference your models

namespace BackendAPI.Services
{
    public class DatabaseService
    {
        private readonly SQLiteAsyncConnection _database;

        public DatabaseService(string dbPath)
        {
            _database = new SQLiteAsyncConnection(dbPath);
        }

        public Task CreateTableAsync<T>() where T : new()
        {
            return _database.CreateTableAsync<T>();
        }

        public Task<List<T>> GetItemsAsync<T>() where T : new()
        {
            return _database.Table<T>().ToListAsync();
        }

        public Task<int> SaveItemAsync<T>(T item) where T : new()
        {
            var propertyInfo = item?.GetType().GetProperty("Id");
            if (propertyInfo != null)
            {
                var value = propertyInfo.GetValue(item);
                if (value != null && (int)value != 0)
                {
                    return _database.UpdateAsync(item);
                }
            }
            return _database.InsertAsync(item);
        }

        public Task<int> DeleteItemAsync<T>(T item) where T : new()
        {
            return _database.DeleteAsync(item);
        }

        // Create tables for all models
        private async Task CreateTablesAsync()
        {
            await _database.CreateTableAsync<Product>();
            await _database.CreateTableAsync<Category>();
            await _database.CreateTableAsync<Customer>();
            await _database.CreateTableAsync<Address>();
            await _database.CreateTableAsync<Supplier>();
            await _database.CreateTableAsync<Review>();
            await _database.CreateTableAsync<Invoice>();
            await _database.CreateTableAsync<InvoiceItem>();
        }

        public async Task PopulateTablesWithDummyDataAsync()
        {
            // Populate Address
            var addresses = new List<Address>
            {
                new Address { Street = "123 Main St", City = "Anytown", PostalCode = "12345", Country = "Poland" },
                new Address { Street = "456 Oak St", City = "Othertown", PostalCode = "67890", Country = "Germany" },
                new Address { Street = "789 Pine St", City = "Sometown", PostalCode = "11223", Country = "France" },
                new Address { Street = "101 Maple St", City = "Yourtown", PostalCode = "33445", Country = "Italy" },
                new Address { Street = "202 Birch St", City = "Mytown", PostalCode = "55667", Country = "Spain" }
            };
            foreach (var address in addresses)
            {
                await SaveItemAsync(address);
            }

            // Populate Category
            var categories = new List<Category>
            {
                new Category { Name = "Electronics" },
                new Category { Name = "Clothing" },
                new Category { Name = "Books" },
                new Category { Name = "Furniture" },
                new Category { Name = "Food" }
            };
            foreach (var category in categories)
            {
                await SaveItemAsync(category);
            }

            // Populate Customer
            var customers = new List<Customer>
            {
                new Customer { Name = "John Doe", Email = "john.doe@example.com" },
                new Customer { Name = "Jane Smith", Email = "jane.smith@example.com" },
                new Customer { Name = "Alice Johnson", Email = "alice.johnson@example.com" },
                new Customer { Name = "Bob Brown", Email = "bob.brown@example.com" },
                new Customer { Name = "Charlie Davis", Email = "charlie.davis@example.com" }
            };
            foreach (var customer in customers)
            {
                await SaveItemAsync(customer);
            }

            // Populate Invoice
            var invoices = new List<Invoice>
            {
                new Invoice { CustomerId = 1, Date = DateTime.Now, TotalAmount = 999.99m },
                new Invoice { CustomerId = 2, Date = DateTime.Now, TotalAmount = 29.99m },
                new Invoice { CustomerId = 3, Date = DateTime.Now, TotalAmount = 14.99m },
                new Invoice { CustomerId = 4, Date = DateTime.Now, TotalAmount = 499.99m },
                new Invoice { CustomerId = 5, Date = DateTime.Now, TotalAmount = 12.99m }
            };
            foreach (var invoice in invoices)
            {
                await SaveItemAsync(invoice);
            }

            // Populate InvoiceItem (Assuming invoices and products exist)
            var invoiceItems = new List<InvoiceItem>
            {
                new InvoiceItem { InvoiceId = 1, ProductId = 1, Quantity = 1, Price = 999.99m },
                new InvoiceItem { InvoiceId = 2, ProductId = 2, Quantity = 1, Price = 29.99m },
                new InvoiceItem { InvoiceId = 3, ProductId = 3, Quantity = 1, Price = 14.99m },
                new InvoiceItem { InvoiceId = 4, ProductId = 4, Quantity = 1, Price = 499.99m },
                new InvoiceItem { InvoiceId = 5, ProductId = 5, Quantity = 1, Price = 12.99m }
            };
            foreach (var invoiceItem in invoiceItems)
            {
                await SaveItemAsync(invoiceItem);
            }

            // Populate Product
            var products = new List<Product>
            {
                new Product { Name = "Running Shoes", Price = 59.99m, CategoryId = 1, SupplierId = 1 },
                new Product { Name = "Hiking Backpack", Price = 89.99m, CategoryId = 2, SupplierId = 2 },
                new Product { Name = "Water Bottle", Price = 9.99m, CategoryId = 3, SupplierId = 3 },
                new Product { Name = "Tent", Price = 199.99m, CategoryId = 4, SupplierId = 4 },
                new Product { Name = "Sleeping Bag", Price = 49.99m, CategoryId = 5, SupplierId = 5 }
            };
            foreach (var product in products)
            {
                await SaveItemAsync(product);
            }

            // Populate Review (Assuming products and customers already exist)
            var reviews = new List<Review>
            {
                new Review { ProductId = 1, CustomerId = 1, Rating = 5, Content = "Great laptop, fast and reliable!" },
                new Review { ProductId = 2, CustomerId = 2, Rating = 4, Content = "Nice shirt, good quality." },
                new Review { ProductId = 3, CustomerId = 3, Rating = 3, Content = "Good book, but the plot was predictable." },
                new Review { ProductId = 4, CustomerId = 4, Rating = 5, Content = "Comfortable and stylish sofa." },
                new Review { ProductId = 5, CustomerId = 5, Rating = 4, Content = "Delicious pizza, but a bit too salty." }
            };
            foreach (var review in reviews)
            {
                await SaveItemAsync(review);
            }

            var suppliers = new List<Supplier>
            {
                new Supplier { Name = "Tech Supplies Co.", ContactEmail = "supplier1@test.com" },
                new Supplier { Name = "Fashion World Ltd.", ContactEmail = "supplier2@test.com" },
                new Supplier { Name = "Book Haven", ContactEmail = "supplier3@test.com" },
                new Supplier { Name = "Home Comforts Inc.", ContactEmail = "supplier4@test.com" },
                new Supplier { Name = "Fresh Goods Ltd.", ContactEmail = "supplier5@test.com" }
            };
            foreach (var supplier in suppliers)
            {
                await SaveItemAsync(supplier);
            }


        }
    }
}
