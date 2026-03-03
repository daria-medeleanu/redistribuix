using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class LocationRepository : ILocationRepository
    {
        private readonly ApplicationDbContext context;

        public LocationRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Location>> GetAllAsync()
        {
            return await context.Locations.ToListAsync();
        }

        public async Task<Location?> GetByIdAsync(Guid id)
        {
            return await context.Locations.FindAsync(id);
        }

        public async Task<Result<Guid>> AddAsync(Location location)
        {
            try
            {
                await context.Locations.AddAsync(location);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(location.LocationId);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure(ex.InnerException?.ToString() ?? ex.Message);
            }
        }

        public async Task UpdateAsync(Location location)
        {
            context.Entry(location).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task<Result<Guid>> DeleteAsync(Guid id)
        {
            var location = await context.Locations.FindAsync(id);
            if (location != null)
            {
                context.Locations.Remove(location);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(id);
            }
            return Result<Guid>.Failure("Location not found.");
        }
    }
}
