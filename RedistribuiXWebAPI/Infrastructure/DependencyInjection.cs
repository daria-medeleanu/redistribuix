using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));


            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<ILocationRepository, LocationRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IStandManagerRepository, StandManagerRepository>();
            services.AddScoped<IPhoneModelRepository, PhoneModelRepository>();

            services.AddScoped<ApplicationDbContext>();

            return services;
        }
    }
}
