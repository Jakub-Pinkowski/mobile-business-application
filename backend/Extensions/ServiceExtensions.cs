using BackendAPI.Services;
namespace BackendAPI.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add services to the container
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        // Register DatabaseService
        string dbPath = Path.Combine(Directory.GetCurrentDirectory(), "BackendAPI.db3");
        var databaseService = new DatabaseService(dbPath);
        services.AddSingleton(databaseService);

        // Add CORS policy
        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhost", policy =>
            {
                policy.WithOrigins("http://localhost:8081")
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });

        return services;
    }
}
