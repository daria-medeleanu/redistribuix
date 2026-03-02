using Domain.Entities;

namespace Domain.Repositories
{
    public interface IDailySaleRepository
    {
        Task<IEnumerable<DailySale>> GetAllAsync();
        Task<DailySale?> GetByIdAsync(int id);
        Task AddAsync(DailySale dailySale);
        Task UpdateAsync(DailySale dailySale);
        Task DeleteAsync(int id);
    }
}
