using SQLite;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackendAPI.Models;

namespace BackendAPI.Services
{
    public class DatabaseService
    {
        private readonly SQLiteAsyncConnection _database;

        public DatabaseService(string dbPath)
        {
            _database = new SQLiteAsyncConnection(dbPath);
        }

        // Create table for a given model
        public Task CreateTableAsync<T>() where T : class, IIdentifiable, new()
        {
            return _database.CreateTableAsync<T>();
        }

        // Get all items of a given model
        public Task<List<T>> GetItemsAsync<T>() where T : class, IIdentifiable, new()
        {
            return _database.Table<T>().ToListAsync();
        }

        // Get a single item by ID
        public Task<T> GetItemByIdAsync<T>(int id) where T : class, IIdentifiable, new()
        {
            return _database.Table<T>().Where(i => i.Id == id).FirstOrDefaultAsync();
        }

        // Save an item (Insert or Update)
        public Task<int> SaveItemAsync<T>(T item) where T : class, IIdentifiable, new()
        {
            var value = item?.GetType().GetProperty("Id")?.GetValue(item);
            if (value != null && (int)value != 0)
            {
                // If the item already has an ID, update it
                return _database.UpdateAsync(item);
            }
            // If no ID, insert it
            return _database.InsertAsync(item);
        }

        // Update an existing item by ID
        public Task<int> UpdateItemAsync<T>(int id, T updatedItem) where T : class, IIdentifiable, new()
        {
            var existingItem = _database.Table<T>().Where(i => i.Id == id).FirstOrDefaultAsync().Result;
            if (existingItem != null)
            {
                return _database.UpdateAsync(updatedItem); // Updates the item
            }
            return Task.FromResult(0); // No item found
        }

        // Delete an item by ID
        public Task<int> DeleteItemAsync<T>(int id) where T : class, IIdentifiable, new()
        {
            var item = _database.Table<T>().Where(i => i.Id == id).FirstOrDefaultAsync().Result;
            if (item != null)
            {
                return _database.DeleteAsync(item);
            }
            return Task.FromResult(0); // No item found to delete
        }

        // Delete an item by its object instance
        public Task<int> DeleteItemAsync<T>(T item) where T : class, IIdentifiable, new()
        {
            return _database.DeleteAsync(item);
        }

        // Drop all tables for all models
        public async Task DropAllTablesAsync()
        {
            await _database.DropTableAsync<Address>();
            await _database.DropTableAsync<Category>();
            await _database.DropTableAsync<Customer>();
            await _database.DropTableAsync<Invoice>();
            await _database.DropTableAsync<InvoiceItem>();
            await _database.DropTableAsync<News>();
            await _database.DropTableAsync<Product>();
            await _database.DropTableAsync<Review>();
            await _database.DropTableAsync<Supplier>();
            await _database.DropTableAsync<Tag>();
            await _database.DropTableAsync<ProductTag>();
        }

        // Create tables for all models
        public async Task CreateTablesAsync()
        {

            await _database.CreateTableAsync<Address>();
            await _database.CreateTableAsync<Category>();
            await _database.CreateTableAsync<Customer>();
            await _database.CreateTableAsync<Invoice>();
            await _database.CreateTableAsync<InvoiceItem>();
            await _database.CreateTableAsync<News>();
            await _database.CreateTableAsync<Product>();
            await _database.CreateTableAsync<Review>();
            await _database.CreateTableAsync<Supplier>();
            await _database.CreateTableAsync<Tag>();
            await _database.CreateTableAsync<ProductTag>();
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

            // Save addresses and keep track of their IDs
            var addressIds = new List<int>();
            foreach (var address in addresses)
            {
                await SaveItemAsync(address);
                addressIds.Add(address.Id); // Save the ID of the inserted address
            }

            // Populate Category
            var categories = new List<Category>
            {
                new Category { Name = "Electronics" },
                new Category { Name = "Clothing" },
                new Category { Name = "Books" },
                new Category { Name = "Furniture" },
                new Category { Name = "Sports" }
            };
            foreach (var category in categories)
            {
                await SaveItemAsync(category);
            }

            // Populate Supplier
            var suppliers = new List<Supplier>
            {
                new Supplier { Name = "Tech Supplies Co.", ContactEmail = "supplier1@test.com" },
                new Supplier { Name = "Fashion World Ltd.", ContactEmail = "supplier2@test.com" },
                new Supplier { Name = "Sporting Goods Inc.", ContactEmail = "supplier3@test.com" },
                new Supplier { Name = "Home Comforts Inc.", ContactEmail = "supplier4@test.com" },
                new Supplier { Name = "Outdoor Adventure Ltd.", ContactEmail = "supplier5@test.com" }
            };
            foreach (var supplier in suppliers)
            {
                await SaveItemAsync(supplier);
            }

            // Populate Product (linked to categories and suppliers)
            var products = new List<Product>
            {
                new Product { Name = "Mountain Bike", Price = 500m, Description = "Durable mountain bike designed for all terrains and tough rides.", CategoryId = 1, SupplierId = 1 },
                new Product { Name = "Road Bike", Price = 400m, Description = "Lightweight road bike, perfect for fast riding on paved roads.", CategoryId = 1, SupplierId = 2 },
                new Product { Name = "Cycling Cap", Price = 20m, Description = "Comfortable cycling cap to protect you from the sun during long rides.", CategoryId = 2, SupplierId = 3 },
                new Product { Name = "Sports Cap", Price = 15m, Description = "Stylish sports cap with adjustable straps for a perfect fit.", CategoryId = 2, SupplierId = 4 },
                new Product { Name = "Backpack 20L", Price = 45m, Description = "Compact backpack with 20L capacity, perfect for day trips.", CategoryId = 3, SupplierId = 5 },
                new Product { Name = "Backpack 40L", Price = 70m, Description = "Large 40L backpack with multiple compartments for extended trips.", CategoryId = 3, SupplierId = 1 },
                new Product { Name = "Running Shoes", Price = 80m, Description = "Breathable running shoes designed for comfort during long runs.", CategoryId = 4, SupplierId = 2 },
                new Product { Name = "Trekking Boots", Price = 120m, Description = "Sturdy trekking boots for outdoor adventures and rough terrains.", CategoryId = 4, SupplierId = 3 }
            };

            foreach (var product in products)
            {
                await SaveItemAsync(product);
            }

            // Populate Customer and associate each with an Address
            var customers = new List<Customer>
            {
                new Customer { Name = "John Doe", Email = "john.doe@example.com", RegistrationDate = new DateTime(2023, 1, 15), PhoneNumber = "+1 234 567 890", AddressId = addressIds[0] },
                new Customer { Name = "Jane Smith", Email = "jane.smith@example.com", RegistrationDate = new DateTime(2023, 3, 22), PhoneNumber = "+1 987 654 321", AddressId = addressIds[1] },
                new Customer { Name = "Alice Johnson", Email = "alice.johnson@example.com", RegistrationDate = new DateTime(2023, 6, 5), PhoneNumber = "+1 555 123 456", AddressId = addressIds[2] },
                new Customer { Name = "Bob Brown", Email = "bob.brown@example.com", RegistrationDate = new DateTime(2023, 9, 10), PhoneNumber = "+1 444 567 890", AddressId = addressIds[3] },
                new Customer { Name = "Charlie Davis", Email = "charlie.davis@example.com", RegistrationDate = new DateTime(2023, 12, 1), PhoneNumber = "+1 333 678 901", AddressId = addressIds[4] }
            };
            foreach (var customer in customers)
            {
                await SaveItemAsync(customer);
            }

            // Populate Invoice (linked to customers)
            var invoices = new List<Invoice>
            {
                new Invoice { CustomerId = 1, Date = DateTime.Now, TotalAmount = 500m },  // Matches the price of the Mountain Bike
                new Invoice { CustomerId = 2, Date = DateTime.Now, TotalAmount = 400m },  // Matches the price of the Road Bike
                new Invoice { CustomerId = 3, Date = DateTime.Now, TotalAmount = 20m },   // Matches the price of the Cycling Cap
                new Invoice { CustomerId = 4, Date = DateTime.Now, TotalAmount = 15m },   // Matches the price of the Sports Cap
                new Invoice { CustomerId = 5, Date = DateTime.Now, TotalAmount = 45m }    // Matches the price of the Backpack 20L
            };
            foreach (var invoice in invoices)
            {
                await SaveItemAsync(invoice);
            }

            // Populate InvoiceItem (linked to invoices and products)
            var invoiceItems = new List<InvoiceItem>
            {
                new InvoiceItem { InvoiceId = 1, ProductId = 1, Quantity = 1, Price = 500m },  // Mountain Bike
                new InvoiceItem { InvoiceId = 2, ProductId = 2, Quantity = 1, Price = 400m },  // Road Bike
                new InvoiceItem { InvoiceId = 3, ProductId = 3, Quantity = 1, Price = 20m },   // Cycling Cap
                new InvoiceItem { InvoiceId = 4, ProductId = 4, Quantity = 1, Price = 15m },   // Sports Cap
                new InvoiceItem { InvoiceId = 5, ProductId = 5, Quantity = 1, Price = 45m }    // Backpack 20L
            };
            foreach (var invoiceItem in invoiceItems)
            {
                await SaveItemAsync(invoiceItem);
            }

            // Populate News
            var news = new List<News>
            {
                new News { Title = "New Office Opening", Description = "Our company has officially inaugurated a new office in downtown New York.", Date = DateTime.Now },
                new News { Title = "Quarterly Revenue Report", Description = "We are thrilled to announce that we achieved record-breaking revenues.", Date = DateTime.Now },
                new News { Title = "Employee of the Month", Description = "Congratulations to Jane Doe for being awarded Employee of the Month.", Date = DateTime.Now }
            };
            foreach (var newsItem in news)
            {
                await SaveItemAsync(newsItem);
            }

            // Populate Tag and ProductTag (many-to-many relationship)
            var tags = new List<Tag>
            {
                new Tag { Name = "Mountain" },
                new Tag { Name = "Road" },
                new Tag { Name = "Cycling" },
                new Tag { Name = "Sports" },
                new Tag { Name = "Outdoor" }
            };
            foreach (var tag in tags)
            {
                await SaveItemAsync(tag);
            }

            // Get the inserted tags' IDs
            var tagIds = await _database.Table<Tag>().ToListAsync();

            // Populate ProductTag (many-to-many relationships between Products and Tags)
            var productTags = new List<ProductTag>
            {
                new ProductTag { ProductId = 1, TagId = tagIds.First(t => t.Name == "Mountain").Id },
                new ProductTag { ProductId = 2, TagId = tagIds.First(t => t.Name == "Road").Id },
                new ProductTag { ProductId = 1, TagId = tagIds.First(t => t.Name == "Cycling").Id },
                new ProductTag { ProductId = 3, TagId = tagIds.First(t => t.Name == "Cycling").Id },
                new ProductTag { ProductId = 4, TagId = tagIds.First(t => t.Name == "Sports").Id },
                new ProductTag { ProductId = 5, TagId = tagIds.First(t => t.Name == "Outdoor").Id },
                new ProductTag { ProductId = 6, TagId = tagIds.First(t => t.Name == "Outdoor").Id }
            };
            foreach (var productTag in productTags)
            {
                await SaveItemAsync(productTag);
            }

        }

        public async Task ResetDatabaseAsync()
        {
            await DropAllTablesAsync();
            await CreateTablesAsync();
            await PopulateTablesWithDummyDataAsync();
        }

        public async Task TestDatabaseAsync()
        {
            // Test fetching all products from the Product table
            var products = await _database.Table<Product>().ToListAsync();
            Console.WriteLine("Products:");
            foreach (var product in products)
            {
                Console.WriteLine($"Id: {product.Id}, Name: {product.Name}, Price: {product.Price}");
            }

            // Test fetching all categories from the Category table
            var categories = await _database.Table<Category>().ToListAsync();
            Console.WriteLine("Categories:");
            foreach (var category in categories)
            {
                Console.WriteLine($"Id: {category.Id}, Name: {category.Name}");
            }

            // You can add similar blocks to check other tables, like Customers, Suppliers, etc.
        }
    }
}
