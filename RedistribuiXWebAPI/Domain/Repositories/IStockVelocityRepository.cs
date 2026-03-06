using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IStockVelocityRepository
    {
        Task<IEnumerable<StockVelocity>> GetAllAsync();
        Task<IEnumerable<StockVelocity>> GetByLocationAsync(Guid locationId);
        Task<StockVelocity> GetByIdAsync(Guid id);
        Task AddAsync(StockVelocity stockVelocity);
        Task UpdateAsync(StockVelocity stockVelocity);
        Task DeleteAsync(Guid id);
    }
}
