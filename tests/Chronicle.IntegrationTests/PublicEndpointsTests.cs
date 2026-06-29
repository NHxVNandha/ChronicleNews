using System.Net;
using System.Net.Http.Json;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class PublicEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Anonymous_CanGetArticles()
    {
        var response = await Client.GetAsync("/api/articles?page=1&pageSize=10&sort=newest");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var payload = await response.Content.ReadFromJsonAsync<TestApiResponse<List<object>>>();
        payload.Should().NotBeNull();
        payload!.Data.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Anonymous_CanGetArticleBySlug()
    {
        var response = await Client.GetAsync("/api/articles/architecture-of-truth");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Anonymous_CanGetCategories()
    {
        var response = await Client.GetAsync("/api/categories");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var payload = await response.Content.ReadFromJsonAsync<TestApiResponse<List<object>>>();
        payload.Should().NotBeNull();
        payload!.Data.Should().NotBeEmpty();
    }
}
