using System.Net;
using System.Net.Http.Json;
using Chronicle.Application.Categories.Dtos;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class CategoryEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Editor_CanCreateCategory()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var response = await Client.PostAsJsonAsync("/api/categories", new CreateCategoryRequest
        {
            Name = "Science",
            Description = "Research and discoveries.",
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task Author_CannotCreateCategory()
    {
        await AuthorizeAsync("author@chronicle.press", "Password123!");

        var response = await Client.PostAsJsonAsync("/api/categories", new CreateCategoryRequest
        {
            Name = "Blocked",
            Description = "Should fail.",
        });

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
