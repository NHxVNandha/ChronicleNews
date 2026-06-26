using Chronicle.Application.Common.Models;

namespace Chronicle.Application.Abstractions.Identity;

public interface ICurrentUserService
{
    CurrentUserInfo GetCurrentUser();
}
