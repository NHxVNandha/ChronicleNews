using System.Net;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class MediaEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task EditorialUser_CanGetMediaAssets()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/media");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Anonymous_CannotGetMediaAssets()
    {
        var response = await Client.GetAsync("/api/media");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
