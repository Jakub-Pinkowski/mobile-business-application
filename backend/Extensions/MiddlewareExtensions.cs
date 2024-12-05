namespace BackendAPI.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder ConfigureMiddleware(this IApplicationBuilder app)
    {
        var env = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

        // Enable Swagger for development
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Enable CORS
        app.UseCors("AllowLocalhost");

        // HTTPS Redirection
        app.UseHttpsRedirection();

        return app;
    }
}
