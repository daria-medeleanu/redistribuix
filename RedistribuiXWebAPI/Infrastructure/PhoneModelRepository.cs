using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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

        public async Task<PhoneModel> GetByIdAsync(Guid id)
        {
            return await context.PhoneModels.FindAsync(id);
        }

        public async Task AddAsync(PhoneModel phoneModel)
        {
            await context.PhoneModels.AddAsync(phoneModel);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(PhoneModel phoneModel)
        {
            context.Entry(phoneModel).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var phoneModel = await context.PhoneModels.FindAsync(id);
            if (phoneModel != null)
            {
                context.PhoneModels.Remove(phoneModel);
                await context.SaveChangesAsync();
            }
        }
    }
}
