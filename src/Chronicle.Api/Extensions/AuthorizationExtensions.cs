namespace Chronicle.Api.Extensions;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddAppAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
            options.AddPolicy("EditorialAccess", policy => policy.RequireRole("Admin", "Editor", "Author", "Reviewer"));
            options.AddPolicy("AuthorOrBetter", policy => policy.RequireRole("Admin", "Editor", "Author"));
            options.AddPolicy("ReviewerOrBetter", policy => policy.RequireRole("Admin", "Editor", "Reviewer"));
        });

        return services;
    }
}
