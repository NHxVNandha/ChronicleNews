using Chronicle.Infrastructure.Persistence;
using Chronicle.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Api.Extensions;

public static class ApplicationInitializationExtensions
{
    public static async Task InitializeApplicationAsync(this WebApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await dbContext.Database.MigrateAsync();
        await AppDbSeeder.SeedAsync(dbContext);
    }
}
