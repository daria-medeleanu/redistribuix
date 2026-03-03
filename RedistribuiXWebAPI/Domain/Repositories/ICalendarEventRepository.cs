using Domain.Entities;

namespace Domain.Repositories
{
    public interface ICalendarEventRepository
    {
        Task<IEnumerable<CalendarEvent>> GetAllAsync();
        Task<CalendarEvent?> GetByIdAsync(int id);
        Task AddAsync(CalendarEvent calendarEvent);
        Task UpdateAsync(CalendarEvent calendarEvent);
        Task DeleteAsync(int id);
    }
}
