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
                new Category { Name = "Food" }
            };
            foreach (var category in categories)
            {
                await SaveItemAsync(category);
            }

            // Populate Customer and associate each with an Address
            var customers = new List<Customer>
            {
                new Customer
                {
                    Name = "John Doe",
                    Email = "john.doe@example.com",
                    RegistrationDate = new DateTime(2023, 1, 15),
                    PhoneNumber = "+1 234 567 890",
                    AddressId = addressIds[0]
                },
                new Customer
                {
                    Name = "Jane Smith",
                    Email = "jane.smith@example.com",
                    RegistrationDate = new DateTime(2023, 3, 22),
                    PhoneNumber = "+1 987 654 321",
                    AddressId = addressIds[1]
                },
                new Customer
                {
                    Name = "Alice Johnson",
                    Email = "alice.johnson@example.com",
                    RegistrationDate = new DateTime(2023, 6, 5),
                    PhoneNumber = "+1 555 123 456",
                    AddressId = addressIds[2]
                },
                new Customer
                {
                    Name = "Bob Brown",
                    Email = "bob.brown@example.com",
                    RegistrationDate = new DateTime(2023, 9, 10),
                    PhoneNumber = "+1 444 567 890",
                    AddressId = addressIds[3]
                },
                new Customer
                {
                    Name = "Charlie Davis",
                    Email = "charlie.davis@example.com",
                    RegistrationDate = new DateTime(2023, 12, 1),
                    PhoneNumber = "+1 333 678 901",
                    AddressId = addressIds[4]
                }
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

            // Populate News
            var news = new List<News>
                {
                    new News
                    {
                        Title = "New Office Opening",
                        Description = "Our company has officially inaugurated a new office in downtown New York. This state-of-the-art facility is designed to enhance collaboration, foster innovation, and provide a comfortable workspace for all our employees. We look forward to hosting many successful meetings and events here.",
                        Date = DateTime.Now  // Automatically use today's date
                    },
                    new News
                    {
                        Title = "Quarterly Revenue Report",
                        Description = "We are thrilled to announce that we achieved record-breaking revenues in the fourth quarter of this year! Thanks to the hard work and dedication of our team, we surpassed all projections, setting a strong foundation for continued growth in the coming year. Detailed insights will be shared during our next town hall.",
                        Date = DateTime.Now  // Automatically use today's date
                    },
                    new News
                    {
                        Title = "Employee of the Month",
                        Description = "A big congratulations to Jane Doe for being awarded Employee of the Month! Her outstanding performance, commitment to excellence, and ability to go above and beyond have made a remarkable impact. Jane has set a stellar example for all of us, and we’re lucky to have her on the team!",
                        Date = DateTime.Now  // Automatically use today's date
                    }
                };

            // Save each news item
            foreach (var newsItem in news)
            {
                await SaveItemAsync(newsItem);
            }



            // Populate Product
            var products = new List<Product>
            {
                new Product
                {
                    Name = "Mountain Bike",
                    Price = 500m,
                    Description = "Durable mountain bike designed for all terrains and tough rides.",
                    CategoryId = 1,
                    SupplierId = 1
                },
                new Product
                {
                    Name = "Road Bike",
                    Price = 400m,
                    Description = "Lightweight road bike, perfect for fast riding on paved roads.",
                    CategoryId = 1,
                    SupplierId = 2
                },
                new Product
                {
                    Name = "Cycling Cap",
                    Price = 20m,
                    Description = "Comfortable cycling cap to protect you from the sun during long rides.",
                    CategoryId = 2,
                    SupplierId = 3
                },
                new Product
                {
                    Name = "Sports Cap",
                    Price = 15m,
                    Description = "Stylish sports cap with adjustable straps for a perfect fit.",
                    CategoryId = 2,
                    SupplierId = 4
                },
                new Product
                {
                    Name = "Backpack 20L",
                    Price = 45m,
                    Description = "Compact backpack with 20L capacity, perfect for day trips.",
                    CategoryId = 3,
                    SupplierId = 5
                },
                new Product
                {
                    Name = "Backpack 40L",
                    Price = 70m,
                    Description = "Large 40L backpack with multiple compartments for extended trips.",
                    CategoryId = 3,
                    SupplierId = 1
                },
                new Product
                {
                    Name = "Running Shoes",
                    Price = 80m,
                    Description = "Breathable running shoes designed for comfort during long runs.",
                    CategoryId = 4,
                    SupplierId = 2
                },
                new Product
                {
                    Name = "Trekking Boots",
                    Price = 120m,
                    Description = "Sturdy trekking boots for outdoor adventures and rough terrains.",
                    CategoryId = 4,
                    SupplierId = 3
                }
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
