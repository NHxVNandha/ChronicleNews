using System.Net;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class DashboardEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task EditorialUser_CanAccessDashboardSummary()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/dashboard/summary");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Anonymous_CannotAccessDashboardSummary()
    {
        var response = await Client.GetAsync("/api/dashboard/summary");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
