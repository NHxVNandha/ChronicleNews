using System.Net;
using System.Net.Http.Json;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class OptimizationEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Editor_CanGetSeoSettings()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/seo/settings");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Editor_CanUpdateSeoSettings()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var current = await Client.GetFromJsonAsync<TestApiResponse<SeoSettingsContract>>("/api/seo/settings");
        var response = await Client.PutAsJsonAsync("/api/seo/settings", current!.Data);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Editor_CanGetAiSettings()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/ai-settings");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    private sealed class SeoSettingsContract
    {
        public string DefaultMetaTitle { get; init; } = string.Empty;
        public string MetaDescription { get; init; } = string.Empty;
        public string FocusKeyword { get; init; } = string.Empty;
        public string RobotsTxt { get; init; } = string.Empty;
        public bool EnableCrawling { get; init; }
        public bool IndexArticlePages { get; init; }
        public bool IndexCategoryPages { get; init; }
        public bool NoIndexAuthorPages { get; init; }
    }
}
