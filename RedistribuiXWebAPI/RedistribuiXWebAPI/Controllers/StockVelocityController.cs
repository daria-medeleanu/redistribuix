using Application.Use_Cases.Commands.StockVelocityCommands;
using Application.Use_Cases.Queries.StockVelocityQueries;
using Domain.Common;
using DTOs;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class StockVelocityController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ApplicationDbContext _context;
        public StockVelocityController(IMediator mediator, ApplicationDbContext context)
        {
            this.mediator = mediator;
            this._context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockVelocityDto>>> GetAll()
        {
            var dtos = await mediator.Send(new GetAllStockVelocitiesQuery());
            return Ok(dtos);
        }

        [HttpGet("by-location/{locationId:guid}")]
        public async Task<IActionResult> GetByLocation(Guid locationId)
        {
            var stockVelocities = await _context.StockVelocities
                .Where(sv => sv.LocationId == locationId)
                .ToListAsync();

            return Ok(stockVelocities);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StockVelocityDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetStockVelocityByIdQuery { Id = id });
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStockVelocityCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Data }, new { id = result.Data });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateStockVelocityCommand command)
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
            var result = await mediator.Send(new DeleteStockVelocityByIdCommand(id));
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return NoContent();
        }
    }
}
