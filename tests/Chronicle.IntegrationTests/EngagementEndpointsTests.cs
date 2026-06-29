using System.Net;
using System.Net.Http.Json;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class EngagementEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Reviewer_CanGetComments()
    {
        await AuthorizeAsync("reviewer@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/comments");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Reviewer_CanReplyToComment()
    {
        await AuthorizeAsync("reviewer@chronicle.press", "Password123!");

        var comments = await Client.GetFromJsonAsync<TestApiResponse<List<CommentContract>>>("/api/comments");
        var commentId = comments!.Data.First().Id;

        var response = await Client.PostAsJsonAsync($"/api/comments/{commentId}/reply", new { text = "Review noted." });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task EditorialUser_CanGetCampaigns()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/campaigns");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task EditorialUser_CanGetSubscriberSummary()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/subscribers/summary");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    private sealed class CommentContract
    {
        public string Id { get; init; } = string.Empty;
    }
}
