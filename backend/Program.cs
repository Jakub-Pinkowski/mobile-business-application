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

// Local testing (call the DatabaseService directly here)
// Test the database
await app.Services.GetRequiredService<DatabaseService>().TestDatabaseAsync(); // Test and output data to console

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

// Products endpoint
app.MapGet("/products", async (DatabaseService dbService) =>
{
    var products = await dbService.GetItemsAsync<Product>();
    return Results.Ok(products);
});

// Categories endpoint
app.MapGet("/categories", async (DatabaseService dbService) =>
{
    var categories = await dbService.GetItemsAsync<Category>();
    return Results.Ok(categories);
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
