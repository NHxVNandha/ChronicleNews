using System.Net;
using System.Net.Http.Json;
using Chronicle.Application.Articles.Dtos;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class ArticleEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Author_CanCreateDraft()
    {
        await AuthorizeAsync("author@chronicle.press", "Password123!");

        var response = await Client.PostAsJsonAsync("/api/articles", new CreateArticleRequest
        {
            Title = "Integration Draft",
            Summary = "Summary",
            Body = "<p>Body</p>",
            CategoryId = Guid.Parse("c1111111-1111-1111-1111-111111111111"),
            Status = Chronicle.Domain.Enums.ArticleStatus.Draft,
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task Author_CannotCreatePublishedArticle()
    {
        await AuthorizeAsync("author@chronicle.press", "Password123!");

        var response = await Client.PostAsJsonAsync("/api/articles", new CreateArticleRequest
        {
            Title = "Integration Published",
            Summary = "Summary",
            Body = "<p>Body</p>",
            CategoryId = Guid.Parse("c1111111-1111-1111-1111-111111111111"),
            Status = Chronicle.Domain.Enums.ArticleStatus.Published,
        });

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Reviewer_CanAccessReviewQueue()
    {
        await AuthorizeAsync("reviewer@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/articles/review-queue");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
