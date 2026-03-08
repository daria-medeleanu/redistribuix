

using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class TransferBatchRepository : ITransferBatchRepository
    {
        private readonly ApplicationDbContext context;

        public TransferBatchRepository(ApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<IEnumerable<TransferBatch>> GetAllAsync()
        {
            return await context.TransferBatches
                .Include(tb => tb.SourceLocation)
                .Include(tb => tb.DestinationLocation)
                .Include(tb => tb.Products)
                    .ThenInclude(p => p.Product)
                .ToListAsync();
        }

        public async Task<TransferBatch> GetByIdAsync(Guid id)
        {
            return await context.TransferBatches
                .Include(tb => tb.SourceLocation)
                .Include(tb => tb.DestinationLocation)
                .Include(tb => tb.Products)
                    .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(tb => tb.TransferBatchId == id);
        }

        public async Task<IEnumerable<TransferBatch>> GetByStatusAsync(StatusTransfer status)
        {
            return await context.TransferBatches
                .Include(tb => tb.SourceLocation)
                .Include(tb => tb.DestinationLocation)
                .Include(tb => tb.Products)
                    .ThenInclude(p => p.Product)
                .Where(tb => tb.Status == status)
                .ToListAsync();
        }
        public async Task<IEnumerable<TransferBatch>> GetByStatusAndLocationAsync(Guid locationId, StatusTransfer status)
        {
            return await context.TransferBatches
                .Include(tb => tb.SourceLocation)
                .Include(tb => tb.DestinationLocation)
                .Include(tb => tb.Products)
                    .ThenInclude(p => p.Product)
                .Where(tb => tb.Status == status
                          && (tb.DestinationLocationId == locationId))
                .ToListAsync();
        }
        public async Task AddAsync(TransferBatch transferBatch)
        {
            await context.TransferBatches.AddAsync(transferBatch);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TransferBatch transferBatch)
        {
            context.Entry(transferBatch).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var transferBatch = await context.TransferBatches.FindAsync(id);
            if (transferBatch != null)
            {
                context.TransferBatches.Remove(transferBatch);
                await context.SaveChangesAsync();
            }
        }
    }
}
