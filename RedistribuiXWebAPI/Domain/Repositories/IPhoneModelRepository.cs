using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IPhoneModelRepository
    {
        Task<IEnumerable<PhoneModel>> GetAllAsync();
        Task<PhoneModel?> GetByIdAsync(Guid id);
        Task<Result<Guid>> AddAsync(PhoneModel phoneModel);
        Task UpdateAsync(PhoneModel phoneModel);
        Task<Result<Guid>> DeleteAsync(Guid id);
    }
}
