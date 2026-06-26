using System.Net;
using System.Net.Http.Json;
using Chronicle.Application.Auth.Dtos;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class AuthEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Login_WithValidCredentials_ReturnsTokens()
    {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = "admin@chronicle.press",
            Password = "Password123!",
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var payload = await response.Content.ReadFromJsonAsync<TestApiResponse<LoginResponse>>();
        payload!.Data.AccessToken.Should().NotBeNullOrWhiteSpace();
        payload.Data.RefreshToken.Should().NotBeNullOrWhiteSpace();
        payload.Data.User.Email.Should().Be("admin@chronicle.press");
    }

    [Fact]
    public async Task Me_WithoutToken_ReturnsUnauthorized()
    {
        var response = await Client.GetAsync("/api/auth/me");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
