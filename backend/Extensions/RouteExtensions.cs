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
                    await dbService.SaveItemAsync(newItem);
                    return Results.Created(endpoint, newItem);
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500);
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
                    return Results.Problem(detail: ex.Message, statusCode: 500);
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
                    return Results.Problem(detail: ex.Message, statusCode: 500);
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
            app.MapCrudOperations<Review>("/reviews");
            app.MapCrudOperations<Product>("/products");
            app.MapCrudOperations<Supplier>("/suppliers");

            app.MapCrudOperations<Tag>("/tags");
            app.MapCrudOperations<ProductTag>("/producttags");

            // Add a route for resetting the database
            app.MapGet("/reset-database", async (DatabaseService dbService) =>
            {
                try
                {
                    await dbService.ResetDatabaseAsync();
                    return Results.Ok("Database has been reset successfully.");
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500);
                }
            });

            return app;
        }
    }
}
