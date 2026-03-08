using Domain.Entities;

namespace Domain.Repositories
{
    public interface IStockVelocityRepository
    {
        Task<IEnumerable<StockVelocity>> GetAllAsync();
        Task<IEnumerable<StockVelocity>> GetByLocationAsync(Guid locationId);
        Task<StockVelocity> GetByIdAsync(Guid id);
        Task<StockVelocity?> GetByLocationAndProductAsync(Guid locationId, Guid productId);
        Task AddAsync(StockVelocity stockVelocity);
        Task UpdateAsync(StockVelocity stockVelocity);
        Task DeleteAsync(Guid id);
    }
}