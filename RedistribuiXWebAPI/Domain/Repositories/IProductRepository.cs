using Domain.Common;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(Guid id);
        Task<Result<Guid>> AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task<Result<Guid>> DeleteAsync(Guid id);
    }
}
