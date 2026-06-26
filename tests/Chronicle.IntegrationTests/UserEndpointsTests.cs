using System.Net;
using System.Net.Http.Json;
using Chronicle.Application.Users.Dtos;
using Chronicle.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Chronicle.IntegrationTests;

public sealed class UserEndpointsTests(TestWebApplicationFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Admin_CanGetUsers()
    {
        await AuthorizeAsync("admin@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/users?page=1&pageSize=10");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Editor_CannotGetUsers()
    {
        await AuthorizeAsync("editor@chronicle.press", "Password123!");

        var response = await Client.GetAsync("/api/users?page=1&pageSize=10");
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Admin_CanCreateUser()
    {
        await AuthorizeAsync("admin@chronicle.press", "Password123!");
        var rolesResponse = await Client.GetFromJsonAsync<TestApiResponse<List<Chronicle.Application.Roles.Dtos.RoleResponse>>>("/api/roles");
        var authorRole = rolesResponse!.Data.First(x => x.Name == "Author");
        var uniqueEmail = $"test.writer.{Guid.NewGuid():N}@chronicle.press";

        var response = await Client.PostAsJsonAsync("/api/users", new CreateUserRequest
        {
            FullName = "Test Writer",
            Email = uniqueEmail,
            Password = "Password123!",
            RoleId = authorRole.Id,
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
