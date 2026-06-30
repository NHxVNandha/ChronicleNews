using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace Chronicle.IntegrationTests.Infrastructure;

public sealed class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"ChronicleDbTests_{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            var testConnectionString = Environment.GetEnvironmentVariable("TEST_SQL_CONNECTION_STRING")
                ?? $"Server=localhost;Database={_databaseName};Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = testConnectionString,
                ["Jwt:Issuer"] = "Chronicle.Api",
                ["Jwt:Audience"] = "Chronicle.Frontend",
                ["Jwt:Key"] = "ChronicleSuperSecretKey1234567890",
                ["Jwt:AccessTokenMinutes"] = "15",
                ["Jwt:RefreshTokenDays"] = "7",
            });
        });
    }
}
