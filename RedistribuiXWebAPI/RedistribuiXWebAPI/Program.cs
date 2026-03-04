using Scalar.AspNetCore;
using Infrastructure;
using Application;
using Domain;
var builder = WebApplication.CreateBuilder(args);

var AllowAllOrigins = "AllowAllOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowAllOrigins,
        policy =>
        {
            policy.AllowAnyOrigin();
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
        });
});
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
//builder.Services.AddHttpClient<Application.Services.SalesForecastService>();
builder.Services.AddScoped<Application.Services.TransferRecommendationService>();
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

}

app.UseStaticFiles();
app.UseRouting();
app.UseCors(AllowAllOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
