using Chronicle.Application.Abstractions.Auth;
using Chronicle.Application.Abstractions.Articles;
using Chronicle.Application.Abstractions.ActivityLogs;
using Chronicle.Application.Abstractions.Categories;
using Chronicle.Application.Abstractions.Dashboard;
using Chronicle.Application.Abstractions.Engagement;
using Chronicle.Application.Abstractions.Media;
using Chronicle.Application.Abstractions.Optimization;
using Chronicle.Application.Abstractions.PublicSite;
using Chronicle.Application.Abstractions.Roles;
using Chronicle.Application.Abstractions.Users;
using Chronicle.Application.ActivityLogs.Services;
using Chronicle.Application.Articles.Dtos;
using Chronicle.Application.Articles.Services;
using Chronicle.Application.Articles.Validators;
using Chronicle.Application.Auth.Dtos;
using Chronicle.Application.Auth.Services;
using Chronicle.Application.Auth.Validators;
using Chronicle.Application.Categories.Dtos;
using Chronicle.Application.Categories.Services;
using Chronicle.Application.Categories.Validators;
using Chronicle.Application.Dashboard.Services;
using Chronicle.Application.Engagement.Dtos;
using Chronicle.Application.Engagement.Services;
using Chronicle.Application.Engagement.Validators;
using Chronicle.Application.Media.Services;
using Chronicle.Application.Optimization.Dtos;
using Chronicle.Application.Optimization.Services;
using Chronicle.Application.Optimization.Validators;
using Chronicle.Application.PublicSite.Services;
using Chronicle.Application.Roles.Services;
using Chronicle.Application.Users.Dtos;
using Chronicle.Application.Users.Services;
using Chronicle.Application.Users.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Chronicle.Application.DependencyInjection;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IArticleService, ArticleService>();
        services.AddScoped<IActivityLogService, ActivityLogService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IMediaService, MediaService>();
        services.AddScoped<IEngagementService, EngagementService>();
        services.AddScoped<IOptimizationService, OptimizationService>();
        services.AddScoped<IPublicSiteService, PublicSiteService>();

        services.AddScoped<IValidator<LoginRequest>, LoginRequestValidator>();
        services.AddScoped<IValidator<RefreshTokenRequest>, RefreshTokenRequestValidator>();
        services.AddScoped<IValidator<CreateArticleRequest>, CreateArticleRequestValidator>();
        services.AddScoped<IValidator<UpdateArticleRequest>, UpdateArticleRequestValidator>();
        services.AddScoped<IValidator<ChangeArticleStatusRequest>, ChangeArticleStatusRequestValidator>();
        services.AddScoped<IValidator<ScheduleArticleRequest>, ScheduleArticleRequestValidator>();
        services.AddScoped<IValidator<AddReviewNoteRequest>, AddReviewNoteRequestValidator>();
        services.AddScoped<IValidator<CreateUserRequest>, CreateUserRequestValidator>();
        services.AddScoped<IValidator<UpdateUserRequest>, UpdateUserRequestValidator>();
        services.AddScoped<IValidator<ChangeUserStatusRequest>, ChangeUserStatusRequestValidator>();
        services.AddScoped<IValidator<CreateCategoryRequest>, CreateCategoryRequestValidator>();
        services.AddScoped<IValidator<UpdateCategoryRequest>, UpdateCategoryRequestValidator>();
        services.AddScoped<IValidator<ChangeCommentStatusRequest>, ChangeCommentStatusRequestValidator>();
        services.AddScoped<IValidator<AddCommentReplyRequest>, AddCommentReplyRequestValidator>();
        services.AddScoped<IValidator<CreateCampaignRequest>, CreateCampaignRequestValidator>();
        services.AddScoped<IValidator<UpdateSeoSettingsRequest>, UpdateSeoSettingsRequestValidator>();
        services.AddScoped<IValidator<UpdateAiSettingsRequest>, UpdateAiSettingsRequestValidator>();

        return services;
    }
}
