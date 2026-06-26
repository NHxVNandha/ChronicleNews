using Chronicle.Api.Extensions;
using Chronicle.Api.Middleware;
using Chronicle.Application.DependencyInjection;
using Chronicle.Infrastructure.DependencyInjection;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddApiServices();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAppAuthorization();
builder.Services.AddAppSwagger();

var app = builder.Build();

await app.InitializeApplicationAsync();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseSerilogRequestLogging();
app.UseAuthentication();
app.UseAuthorization();
app.UseAppSwagger();
app.MapApiEndpoints();

app.Run();

public partial class Program;
