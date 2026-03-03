using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext context;

        public ProductRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await context.Products.Include(p => p.PhoneModel).ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await context.Products.Include(p => p.PhoneModel).FirstOrDefaultAsync(p => p.ProductId == id);
        }

        public async Task<Result<Guid>> AddAsync(Product product)
        {
            try
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(product.ProductId);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure(ex.InnerException?.ToString() ?? ex.Message);
            }
        }

        public async Task UpdateAsync(Product product)
        {
            context.Entry(product).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task<Result<Guid>> DeleteAsync(Guid id)
        {
            var product = await context.Products.FindAsync(id);
            if (product != null)
            {
                context.Products.Remove(product);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(id);
            }
            return Result<Guid>.Failure("Product not found.");
        }
    }
}
