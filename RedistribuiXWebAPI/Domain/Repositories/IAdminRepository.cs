using Domain.Common;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IAdminRepository
    {
        Task <IEnumerable<Admin>> GetAllAsync();
        Task<Admin> GetByIdAsync(Guid id);
        Task<Result<Guid>> AddAsync(Admin admin);
        Task UpdateAsync(Admin admin);
        Task DeleteAsync(Guid id);
        Task <LoginResponse?> LoginAsync(string email, string password);
    }
}
