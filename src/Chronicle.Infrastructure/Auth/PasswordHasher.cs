using Chronicle.Application.Abstractions.Auth;
using Chronicle.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Chronicle.Infrastructure.Auth;

public sealed class PasswordHasher : IPasswordHasher
{
    private readonly Microsoft.AspNetCore.Identity.PasswordHasher<User> _passwordHasher = new();

    public string Hash(string password) => _passwordHasher.HashPassword(new User(), password);

    public bool Verify(string password, string hash)
        => _passwordHasher.VerifyHashedPassword(new User(), hash, password) != PasswordVerificationResult.Failed;
}
