

using Domain.Entities;

namespace Domain.Repositories
{
    public interface ITransferBatchProductsRepository
    {
        Task<IEnumerable<TransferBatchProducts>> GetAllByBatchIdAsync(Guid transferBatchId);
        Task<TransferBatchProducts> GetByIdAsync(Guid id);
        Task AddAsync(TransferBatchProducts transferBatchProducts);
        Task UpdateAsync(TransferBatchProducts transferBatchProducts);
        Task DeleteAsync(Guid id);
    }
}
