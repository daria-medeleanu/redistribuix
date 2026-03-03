using Application.DTOs;
using Application.Use_Cases.Commands.TransportCostCommands;
using Application.Use_Cases.Queries.TransportCostQueries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace RedistribuiXWebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TransportCostController : ControllerBase
    {
        private readonly IMediator mediator;

        public TransportCostController(IMediator mediator)
        {
            this.mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransportCostCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTransportCostCommand command)
        {
            if (id != command.TransportCostId)
                return BadRequest("Mismatched TransportCostId.");

            var result = await mediator.Send(command);
            if (result)
                return Ok(new { message = "Transport cost updated successfully." });
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await mediator.Send(new DeleteTransportCostCommand { TransportCostId = id });
            if (result)
                return Ok(new { message = "Transport cost deleted successfully." });
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransportCostDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetTransportCostByIdQuery { TransportCostId = id });
            if (result.IsSuccess)
                return Ok(result.Data);
            return NotFound(result.ErrorMessage);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransportCostDto>>> GetAll()
        {
            var transportCosts = await mediator.Send(new GetAllTransportCostsQuery());
            return Ok(transportCosts);
        }
    }
}
