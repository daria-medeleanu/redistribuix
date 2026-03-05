using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class TransportCostRepository : ITransportCostRepository
    {
        private readonly ApplicationDbContext context;

        public TransportCostRepository(ApplicationDbContext context) {
            this.context = context;
        }
        public async Task<IEnumerable<TransportCost>> GetAllAsync()
        {
            return await context.TransportCosts.ToListAsync();
        }

        public async Task<TransportCost> GetByIdAsync(Guid id)
        {
            return await context.TransportCosts.FirstOrDefaultAsync(tc => tc.TransportCostId == id);
        }
        public async Task<TransportCost?> GetByLocationsAsync(Guid sourceLocationId, Guid destinationLocationId)
        {
            return await context.TransportCosts.FirstOrDefaultAsync(tc =>
                tc.SourceLocationId == sourceLocationId &&
                tc.DestinationLocationId == destinationLocationId);
        }
        public async Task AddAsync(TransportCost transportCost)
        {
            await context.TransportCosts.AddAsync(transportCost);
            await context.SaveChangesAsync();
        }
        public async Task UpdateAsync(TransportCost transportCost)
        {
            context.Entry(transportCost).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }
        public async Task DeleteAsync(Guid id)
        {
            var transportCost = await context.TransportCosts.FindAsync(id);
            if (transportCost != null)
            {
                context.TransportCosts.Remove(transportCost);
                await context.SaveChangesAsync();
            }
        }
        
    }
}
