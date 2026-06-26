using Microsoft.OpenApi;

namespace Chronicle.Api.Extensions;

public static class SwaggerExtensions
{
    public static IServiceCollection AddAppSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Chronicle API",
                Version = "v1",
                Description = "Backend API for Chronicle newsroom CMS.",
            });

            var scheme = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter JWT bearer access token.",
            };

            options.AddSecurityDefinition("Bearer", scheme);
        });

        return services;
    }

    public static WebApplication UseAppSwagger(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI();

        return app;
    }
}
