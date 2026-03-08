using Domain.Entities;
using Domain.Enums;

namespace Domain.Repositories
{
    public interface ITransferBatchRepository
    {
        Task<IEnumerable<TransferBatch>> GetAllAsync();
        Task<TransferBatch> GetByIdAsync(Guid id);
        Task<IEnumerable<TransferBatch>> GetByStatusAsync(StatusTransfer status);
        Task<IEnumerable<TransferBatch>> GetByStatusAndLocationAsync(Guid locationId, StatusTransfer status);

        Task AddAsync(TransferBatch transferBatch);
        Task UpdateAsync(TransferBatch transferBatch);
        Task DeleteAsync(Guid id);
    }
}
