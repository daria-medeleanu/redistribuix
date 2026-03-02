using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IStandManagerRepository
    {
        Task<IEnumerable<StandManager>> GetAllAsync();
        Task<StandManager> GetByIdAsync(Guid id);
        Task AddAsync(StandManager standManager);
        Task UpdateAsync(StandManager standManager);
        Task DeleteAsync(Guid id);
        Task<LoginResponse> LoginAsync(string email, string password);
    }
}
