using Domain.Common;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface ILocationRepository
    {
        Task<IEnumerable<Location>> GetAllAsync();
        Task<Location?> GetByIdAsync(Guid id);
        Task<Result<Guid>> AddAsync(Location location);
        Task UpdateAsync(Location location);
        Task<Result<Guid>> DeleteAsync(Guid id);
    }
}
