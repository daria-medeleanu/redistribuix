

using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class TransferBatchProductsRepository : ITransferBatchProductsRepository
    {
        private readonly ApplicationDbContext context;

        public TransferBatchProductsRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<TransferBatchProducts>> GetAllAsync()
        {
            return await context.TransferBatchProducts
                .Include(tbp => tbp.Product)
                .ToListAsync();
        }
        public async Task<TransferBatchProducts> GetByIdAsync(Guid id)
        {
            return await context.TransferBatchProducts
                .Include(tbp => tbp.Product)
                .FirstOrDefaultAsync(tbp => tbp.TransferBatchProductsId == id);
        }

        public async Task AddAsync(TransferBatchProducts transferBatchProducts)
        {
            await context.TransferBatchProducts.AddAsync(transferBatchProducts);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TransferBatchProducts transferBatchProducts)
        {
            context.Entry(transferBatchProducts).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var transferBatchProducts = await context.TransferBatchProducts.FindAsync(id);
            if (transferBatchProducts != null)
            {
                context.TransferBatchProducts.Remove(transferBatchProducts);
                await context.SaveChangesAsync();
            }
        }
    }
}
