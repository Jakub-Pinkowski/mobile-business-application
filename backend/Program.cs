using BackendAPI;
using BackendAPI.Extensions;


var builder = WebApplication.CreateBuilder(args);

// Configure Services
builder.Services.ConfigureServices(builder.Configuration);

// Build the application
var app = builder.Build();

// Configure Middleware and Routes
app.ConfigureMiddleware();
app.ConfigureRoutes();

app.Run();
