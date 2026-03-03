using Application.DTOs;
using Application.Use_Cases.Commands.TransferBatchCommands;
using Application.Use_Cases.Queries.TransferBatchQueries;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace RedistribuiXWebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TransferBatchController : ControllerBase
    {
        private readonly IMediator mediator;

        public TransferBatchController(IMediator mediator, IConfiguration configuration)
        {
            this.mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransferBatchCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTransferBatchCommand command)
        {
            if (id != command.TransferBatchId)
                return BadRequest("Mismatched TransferBatchId.");

            var result = await mediator.Send(command);
            if (result)
                return Ok(new { message = "Transfer batch updated successfully." });
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await mediator.Send(new DeleteTransferBatchCommand { TransferBatchId = id });
            if (result)
                return Ok(new { message = "Transfer batch deleted successfully." });
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransferBatchDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetTransferBatchByIdQuery { TransferBatchId = id });
            if (result.IsSuccess)
                return Ok(result.Data);
            return NotFound(result.ErrorMessage);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransferBatchDto>>> GetAll()
        {
            var transferBatches = await mediator.Send(new GetAllTransferBatchesQuery());
            return Ok(transferBatches);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<TransferBatchDto>>> GetByStatus(StatusTransfer status)
        {
            var transferBatches = await mediator.Send(new GetTransferBatchesByStatusQuery { Status = status });
            return Ok(transferBatches);
        }
    }
}
