using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class CalendarEventRepository : ICalendarEventRepository
    {
        private readonly ApplicationDbContext context;

        public CalendarEventRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<CalendarEvent>> GetAllAsync()
        {
            return await context.CalendarEvents.ToListAsync();
        }

        public async Task<CalendarEvent?> GetByIdAsync(Guid id)
        {
            return await context.CalendarEvents.FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task AddAsync(CalendarEvent calendarEvent)
        {
            await context.CalendarEvents.AddAsync(calendarEvent);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(CalendarEvent calendarEvent)
        {
            context.Entry(calendarEvent).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await context.CalendarEvents.FindAsync(id);
            if (entity != null)
            {
                context.CalendarEvents.Remove(entity);
                await context.SaveChangesAsync();
            }
        }
    }
}
