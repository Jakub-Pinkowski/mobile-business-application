using BackendAPI.Services;
using BackendAPI.Models;

namespace BackendAPI.Extensions;

public static class RouteExtensions
{
    public static IEndpointRouteBuilder ConfigureRoutes(this IEndpointRouteBuilder app)
    {
        // Address Endpoints
        app.MapGet("/address", async (DatabaseService dbService) =>
        {
            var addresses = await dbService.GetItemsAsync<Address>();
            return Results.Ok(addresses);
        });

        // Categories Endpoint
        app.MapGet("/categories", async (DatabaseService dbService) =>
        {
            var categories = await dbService.GetItemsAsync<Category>();
            return Results.Ok(categories);
        });

        // Customers Endpoint
        app.MapGet("/customers", async (DatabaseService dbService) =>
        {
            var customers = await dbService.GetItemsAsync<Customer>();
            return Results.Ok(customers);
        });

        // Invoice Items Endpoint
        app.MapGet("/invoiceitems", async (DatabaseService dbService) =>
        {
            var invoiceItems = await dbService.GetItemsAsync<InvoiceItem>();
            return Results.Ok(invoiceItems);
        });

        // Invoices Endpoint
        app.MapGet("/invoices", async (DatabaseService dbService) =>
        {
            var invoices = await dbService.GetItemsAsync<Invoice>();
            return Results.Ok(invoices);
        });

        // News Endpoint
        app.MapGet("/news", async (DatabaseService dbService) =>
        {
            var news = await dbService.GetItemsAsync<News>();
            return Results.Ok(news);
        });

        // Product Reviews Endpoint
        app.MapGet("/productreviews", async (DatabaseService dbService) =>
        {
            var productReviews = await dbService.GetItemsAsync<Review>();
            return Results.Ok(productReviews);
        });

        // Products Endpoint
        app.MapGet("/products", async (DatabaseService dbService) =>
        {
            var products = await dbService.GetItemsAsync<Product>();
            return Results.Ok(products);
        });

        // Suppliers Endpoint
        app.MapGet("/suppliers", async (DatabaseService dbService) =>
        {
            var suppliers = await dbService.GetItemsAsync<Supplier>();
            return Results.Ok(suppliers);
        });

        return app;
    }
}
