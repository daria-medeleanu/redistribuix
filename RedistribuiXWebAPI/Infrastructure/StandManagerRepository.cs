using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class StandManagerRepository : IStandManagerRepository
    {
        private readonly ApplicationDbContext context;

        public StandManagerRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<StandManager>> GetAllAsync()
        {
            return await context.StandManagers.Include(sm => sm.Location).ToListAsync();
        }

        public async Task<StandManager> GetByIdAsync(Guid id)
        {
            return await context.StandManagers.Include(sm => sm.Location).FirstOrDefaultAsync(sm => sm.Id == id);
        }

        public async Task AddAsync(StandManager standManager)
        {
            await context.StandManagers.AddAsync(standManager);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(StandManager standManager)
        {
            context.Entry(standManager).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var standManager = await context.StandManagers.FindAsync(id);
            if (standManager != null)
            {
                context.StandManagers.Remove(standManager);
                await context.SaveChangesAsync();
            }
        }

        public async Task<LoginResponse> LoginAsync(string email, string password)
        {
            var standManager = await context.StandManagers.FirstOrDefaultAsync(sm => sm.Email == email);
            if (standManager != null && BCrypt.Net.BCrypt.Verify(password, standManager.PasswordHash))
            {
                // Example: return a dummy token and role
                return new LoginResponse
                {
                    Token = "dummy-token",
                    Role = "StandManager",
                    Id = standManager.Id
                };
            }
            return null;
        }
    }
}
