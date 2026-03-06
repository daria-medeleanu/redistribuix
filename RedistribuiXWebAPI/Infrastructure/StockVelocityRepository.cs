using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class StockVelocityRepository : IStockVelocityRepository
    {
        private readonly ApplicationDbContext context;

        public StockVelocityRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<StockVelocity>> GetAllAsync()
        {
            return await context.StockVelocities
                .Include(s => s.Location)
                .Include(s => s.Product)
                .ToListAsync();
        }

        public async Task<IEnumerable<StockVelocity>> GetByLocationAsync(Guid locationId)
        {
            return await context.StockVelocities
                .Include(s => s.Location)
                .Include(s => s.Product)
                .Where(s => s.LocationId == locationId)
                .ToListAsync();
        }

        public async Task<StockVelocity> GetByIdAsync(Guid id)
        {
            return await context.StockVelocities
                .Include(s => s.Location)
                .Include(s => s.Product)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task AddAsync(StockVelocity stockVelocity)
        {
            await context.StockVelocities.AddAsync(stockVelocity);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(StockVelocity stockVelocity)
        {
            context.Entry(stockVelocity).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await context.StockVelocities.FindAsync(id);
            if (entity != null)
            {
                context.StockVelocities.Remove(entity);
                await context.SaveChangesAsync();
            }
        }
    }
}
