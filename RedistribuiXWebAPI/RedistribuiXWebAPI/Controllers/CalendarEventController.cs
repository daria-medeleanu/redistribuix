using Application.Use_Cases.Commands.CalendarEventCommands;
using Application.Use_Cases.Queries.CalendarEventQueries;
using Domain.Common;
using DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CalendarEventController : ControllerBase
    {
        private readonly IMediator mediator;

        public CalendarEventController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetAll()
        {
            var dtos = await mediator.Send(new GetAllCalendarEventsQuery());
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CalendarEventDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetCalendarEventByIdQuery { Id = id });
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCalendarEventCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Data }, new { id = result.Data });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCalendarEventCommand command)
        {
            if (id != command.Id)
            {
                command.Id = id;
            }

            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await mediator.Send(new DeleteCalendarEventByIdCommand(id));
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return NoContent();
        }
    }
}
