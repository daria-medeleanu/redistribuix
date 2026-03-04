using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Domain.Services;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure
{
    public class StandManagerRepository : IStandManagerRepository
    {
        private readonly ApplicationDbContext context;
        private readonly IConfiguration configuration;

        public StandManagerRepository(ApplicationDbContext context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }

        public async Task<IEnumerable<StandManager>> GetAllAsync()
        {
            return await context.StandManagers.Include(sm => sm.Location).ToListAsync();
        }

        public async Task<StandManager> GetByIdAsync(Guid id)
        {
            return await context.StandManagers.Include(sm => sm.Location)
                .FirstOrDefaultAsync(sm => sm.Id == id);
        }

        public async Task<Result<Guid>> AddAsync(StandManager standManager)
        {
            try
            {
                await context.StandManagers.AddAsync(standManager);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(standManager.Id);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure(ex.InnerException?.ToString() ?? ex.Message);
            }
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
        public async Task<LoginResponse?> LoginAsync(string email, string password)
        {
            var existingStandManager = await context.StandManagers.SingleOrDefaultAsync(sm => sm.Email == email);
            if (existingStandManager == null)
            {
                return null;
            }
            if (!PasswordHasher.VerifyPassword(password, existingStandManager.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, existingStandManager.Id.ToString()),
            new Claim(ClaimTypes.Role, "StandManager")
                }),
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new LoginResponse { Token = tokenString, Role = "StandManager", Id = existingStandManager.Id };
        }

    }
}
