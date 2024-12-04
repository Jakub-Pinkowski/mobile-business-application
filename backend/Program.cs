using BackendAPI.Services;
using BackendAPI.Models;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the DatabaseService as a singleton or scoped service
string dbPath = Path.Combine(Directory.GetCurrentDirectory(), "BackendAPI.db3");
builder.Services.AddSingleton<DatabaseService>(new DatabaseService(dbPath)); // Registers DatabaseService

// Create and configure the application
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Weather forecast endpoint (example)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

// Add all tables with endpoints

// Address endpoint
app.MapGet("/address", async (DatabaseService dbService) =>
{
    var addresses = await dbService.GetItemsAsync<Address>();
    return Results.Ok(addresses);
});

// Category endpoint
app.MapGet("/categories", async (DatabaseService dbService) =>
{
    var categories = await dbService.GetItemsAsync<Category>();
    return Results.Ok(categories);
});

// Customer endpoint
app.MapGet("/customers", async (DatabaseService dbService) =>
{
    var customers = await dbService.GetItemsAsync<Customer>();
    return Results.Ok(customers);
});

// Invoice endpoint
app.MapGet("/invoices", async (DatabaseService dbService) =>
{
    var invoices = await dbService.GetItemsAsync<Invoice>();
    return Results.Ok(invoices);
});

// InvoiceItem endpoint
app.MapGet("/invoiceitems", async (DatabaseService dbService) =>
{
    var invoiceItems = await dbService.GetItemsAsync<InvoiceItem>();
    return Results.Ok(invoiceItems);
});

// ProductReview endpoint
app.MapGet("/productreviews", async (DatabaseService dbService) =>
{
    var productReviews = await dbService.GetItemsAsync<Review>();
    return Results.Ok(productReviews);
});

// Product endpoint
app.MapGet("/products", async (DatabaseService dbService) =>
{
    var products = await dbService.GetItemsAsync<Product>();
    return Results.Ok(products);
});

// Supplier endpoint
app.MapGet("/suppliers", async (DatabaseService dbService) =>
{
    var suppliers = await dbService.GetItemsAsync<Supplier>();
    return Results.Ok(suppliers);
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
