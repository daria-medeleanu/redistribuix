using Domain.Entities;
using Domain.Repositories;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CalendarEventController : ControllerBase
    {
        private readonly ICalendarEventRepository repository;

        public CalendarEventController(ICalendarEventRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetAll()
        {
            var entities = await repository.GetAllAsync();
            var dtos = entities.Select(MapToDto).ToList();
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CalendarEventDto>> GetById(int id)
        {
            var entity = await repository.GetByIdAsync(id);
            if (entity == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(entity));
        }

        [HttpPost]
        public async Task<ActionResult<CalendarEventDto>> Create([FromBody] CalendarEventDto dto)
        {
            var entity = new CalendarEvent
            {
                Name = dto.Name,
                EventType = dto.EventType,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                DemandMultiplier = dto.DemandMultiplier,
                AffectedLocationType = dto.AffectedLocationType
            };

            await repository.AddAsync(entity);

            var createdDto = MapToDto(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CalendarEventDto dto)
        {
            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Name = dto.Name;
            existing.EventType = dto.EventType;
            existing.StartDate = dto.StartDate;
            existing.EndDate = dto.EndDate;
            existing.DemandMultiplier = dto.DemandMultiplier;
            existing.AffectedLocationType = dto.AffectedLocationType;

            await repository.UpdateAsync(existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            await repository.DeleteAsync(id);
            return NoContent();
        }

        private static CalendarEventDto MapToDto(CalendarEvent entity)
        {
            return new CalendarEventDto
            {
                Id = entity.Id,
                Name = entity.Name,
                EventType = entity.EventType,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                DemandMultiplier = entity.DemandMultiplier,
                AffectedLocationType = entity.AffectedLocationType
            };
        }
    }
}
