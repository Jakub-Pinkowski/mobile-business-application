using BackendAPI.Services;
using BackendAPI.Models;

namespace BackendAPI.Extensions
{
    public static class RouteExtensions
    {
        // Generic method to map all CRUD operations for a given model type
        private static void MapCrudOperations<T>(this IEndpointRouteBuilder app, string endpoint) where T : class, IIdentifiable, new()
        {
            // GET endpoint to fetch all records for the model
            app.MapGet(endpoint, async (DatabaseService dbService) =>
            {
                var items = await dbService.GetItemsAsync<T>();
                return Results.Ok(items);
            });

            // POST endpoint to add a new record
            app.MapPost(endpoint, async (DatabaseService dbService, T newItem) =>
            {
                try
                {
                    await dbService.SaveItemAsync(newItem);  // Use SaveItemAsync instead of InsertItemAsync
                    return Results.Created(endpoint, newItem); // 201 Created response
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500); // Correct usage of Problem method
                }
            });

            // PUT endpoint to update an existing record
            app.MapPut($"{endpoint}/{{id}}", async (DatabaseService dbService, int id, T updatedItem) =>
            {
                try
                {
                    var result = await dbService.UpdateItemAsync(id, updatedItem);
                    return result > 0 ? Results.Ok(updatedItem) : Results.NotFound();
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500); // Correct usage of Problem method
                }
            });

            // DELETE endpoint to remove a record by ID
            app.MapDelete($"{endpoint}/{{id}}", async (DatabaseService dbService, int id) =>
            {
                try
                {
                    var deleted = await dbService.DeleteItemAsync<T>(id);
                    return deleted > 0 ? Results.NoContent() : Results.NotFound();
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500); // Correct usage of Problem method
                }
            });
        }

        public static IEndpointRouteBuilder ConfigureRoutes(this IEndpointRouteBuilder app)
        {
            // Map CRUD operations for each table using the MapCrudOperations helper
            app.MapCrudOperations<Address>("/address");
            app.MapCrudOperations<Category>("/categories");
            app.MapCrudOperations<Customer>("/customers");
            app.MapCrudOperations<InvoiceItem>("/invoiceitems");
            app.MapCrudOperations<Invoice>("/invoices");
            app.MapCrudOperations<News>("/news");
            app.MapCrudOperations<Review>("/productreviews");
            app.MapCrudOperations<Product>("/products");
            app.MapCrudOperations<Supplier>("/suppliers");

            return app;
        }
    }
}
