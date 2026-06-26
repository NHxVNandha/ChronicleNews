using System.Net.Http.Headers;
using System.Net.Http.Json;
using Chronicle.Application.Auth.Dtos;

namespace Chronicle.IntegrationTests.Infrastructure;

public abstract class ApiTestBase : IClassFixture<TestWebApplicationFactory>
{
    protected ApiTestBase(TestWebApplicationFactory factory)
    {
        Factory = factory;
        Client = factory.CreateClient();
    }

    protected TestWebApplicationFactory Factory { get; }
    protected HttpClient Client { get; }

    protected async Task<LoginResponse> LoginAsync(string email, string password)
    {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = email,
            Password = password,
        });

        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadFromJsonAsync<TestApiResponse<LoginResponse>>();
        return payload!.Data;
    }

    protected async Task AuthorizeAsync(string email, string password)
    {
        var login = await LoginAsync(email, password);
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.AccessToken);
    }
}

public sealed class TestApiResponse<T>
{
    public T Data { get; init; } = default!;
    public object? Meta { get; init; }
}

public sealed class TestErrorResponse
{
    public TestApiError Error { get; init; } = default!;
}

public sealed class TestApiError
{
    public string Code { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
}
