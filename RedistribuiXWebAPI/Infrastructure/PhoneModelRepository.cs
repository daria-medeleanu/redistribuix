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
    public class PhoneModelRepository : IPhoneModelRepository
    {
        private readonly ApplicationDbContext context;

        public PhoneModelRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<PhoneModel>> GetAllAsync()
        {
            return await context.PhoneModels.ToListAsync();
        }

        public async Task<PhoneModel?> GetByIdAsync(Guid id)
        {
            return await context.PhoneModels.FirstOrDefaultAsync(pm => pm.ModelId == id);
        }

        public async Task<Result<Guid>> AddAsync(PhoneModel phoneModel)
        {
            try
            {
                await context.PhoneModels.AddAsync(phoneModel);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(phoneModel.ModelId);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure(ex.InnerException?.ToString() ?? ex.Message);
            }
        }

        public async Task UpdateAsync(PhoneModel phoneModel)
        {
            context.Entry(phoneModel).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task<Result<Guid>> DeleteAsync(Guid id)
        {
            var phoneModel = await context.PhoneModels.FindAsync(id);
            if (phoneModel != null)
            {
                context.PhoneModels.Remove(phoneModel);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(id);
            }
            return Result<Guid>.Failure("Phone model not found.");
        }
    }
}
