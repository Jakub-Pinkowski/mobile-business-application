using BackendAPI.Services;
using BackendAPI.Models;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the DatabaseService as a singleton or scoped service
string dbPath = Path.Combine(Directory.GetCurrentDirectory(), "BackendAPI.db3");
var databaseService = new DatabaseService(dbPath);
builder.Services.AddSingleton(databaseService); // Registers DatabaseService

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:8081") // Allow frontend running on Expo or React Native
              .AllowAnyMethod() // Allow all HTTP methods (GET, POST, etc.)
              .AllowAnyHeader(); // Allow all headers
    });
});

// Create and configure the application
var app = builder.Build();

// Enable CORS with the policy
app.UseCors("AllowLocalhost");

// Reset the database at startup
// TODO: Use when needed
// await databaseService.ResetDatabaseAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add all tables with endpoints
app.MapGet("/address", async (DatabaseService dbService) =>
{
    var addresses = await dbService.GetItemsAsync<Address>();
    return Results.Ok(addresses);
});

app.MapGet("/categories", async (DatabaseService dbService) =>
{
    var categories = await dbService.GetItemsAsync<Category>();
    return Results.Ok(categories);
});

app.MapGet("/customers", async (DatabaseService dbService) =>
{
    var customers = await dbService.GetItemsAsync<Customer>();
    return Results.Ok(customers);
});

app.MapGet("/invoices", async (DatabaseService dbService) =>
{
    var invoices = await dbService.GetItemsAsync<Invoice>();
    return Results.Ok(invoices);
});

app.MapGet("/invoiceitems", async (DatabaseService dbService) =>
{
    var invoiceItems = await dbService.GetItemsAsync<InvoiceItem>();
    return Results.Ok(invoiceItems);
});

app.MapGet("/productreviews", async (DatabaseService dbService) =>
{
    var productReviews = await dbService.GetItemsAsync<Review>();
    return Results.Ok(productReviews);
});

app.MapGet("/products", async (DatabaseService dbService) =>
{
    var products = await dbService.GetItemsAsync<Product>();
    return Results.Ok(products);
});

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
