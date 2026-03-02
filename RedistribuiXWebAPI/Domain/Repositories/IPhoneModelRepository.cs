using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IPhoneModelRepository
    {
        Task<IEnumerable<PhoneModel>> GetAllAsync();
        Task<PhoneModel> GetByIdAsync(Guid id);
        Task AddAsync(PhoneModel phoneModel);
        Task UpdateAsync(PhoneModel phoneModel);
        Task DeleteAsync(Guid id);
    }
}
