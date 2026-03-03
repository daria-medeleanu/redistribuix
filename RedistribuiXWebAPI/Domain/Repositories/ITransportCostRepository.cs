using Domain.Entities;

namespace Domain.Repositories
{
    public interface ITransportCostRepository
    {
        Task<IEnumerable<TransportCost>> GetAllAsync();
        Task<TransportCost> GetByIdAsync(Guid id);
        Task AddAsync(TransportCost transportCost);
        Task UpdateAsync(TransportCost transportCost);
        Task DeleteAsync(Guid id);
    }
}
