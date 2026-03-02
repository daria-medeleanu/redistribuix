using Application.Use_Cases.Commands.DailySaleCommands;
using Application.Use_Cases.Queries.DailySaleQueries;
using Domain.Common;
using DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DailySaleController : ControllerBase
    {
        private readonly IMediator mediator;

        public DailySaleController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DailySaleDto>>> GetAll()
        {
            var dtos = await mediator.Send(new GetAllDailySalesQuery());
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DailySaleDto>> GetById(int id)
        {
            var result = await mediator.Send(new GetDailySaleByIdQuery { Id = id });
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDailySaleCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Data }, new { id = result.Data });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDailySaleCommand command)
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
        public async Task<IActionResult> Delete(int id)
        {
            var result = await mediator.Send(new DeleteDailySaleByIdCommand(id));
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return NoContent();
        }
    }
}
