using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class DailySaleRepository : IDailySaleRepository
    {
        private readonly ApplicationDbContext context;

        public DailySaleRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<DailySale>> GetAllAsync()
        {
            return await context.DailySales
                .Include(d => d.Location)
                .Include(d => d.Product)
                .ToListAsync();
        }

        public async Task<DailySale?> GetByIdAsync(Guid id)
        {
            return await context.DailySales
                .Include(d => d.Location)
                .Include(d => d.Product)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task AddAsync(DailySale dailySale)
        {
            await context.DailySales.AddAsync(dailySale);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(DailySale dailySale)
        {
            context.Entry(dailySale).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await context.DailySales.FindAsync(id);
            if (entity != null)
            {
                context.DailySales.Remove(entity);
                await context.SaveChangesAsync();
            }
        }
    }
}
