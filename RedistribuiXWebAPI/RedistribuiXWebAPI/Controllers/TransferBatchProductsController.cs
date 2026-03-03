using Application.DTOs;
using Application.Use_Cases.Commands.TransferBatchProductsCommands;
using Application.Use_Cases.Queries.TransferBatchProductsQueries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace RedistribuiXWebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TransferBatchProductsController : ControllerBase
    {
        private readonly IMediator mediator;

        public TransferBatchProductsController(IMediator mediator)
        {
            this.mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransferBatchProductsCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTransferBatchProductsCommand command)
        {
            if (id != command.TransferBatchProductsId)
                return BadRequest("Mismatched TransferBatchProductsId.");

            var result = await mediator.Send(command);
            if (result)
                return Ok(new { message = "Transfer batch product updated successfully." });
            return NotFound();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await mediator.Send(new DeleteTransferBatchProductsCommand { TransferBatchProductsId = id });
            if (result)
                return Ok(new { message = "Transfer batch product deleted successfully." });
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransferBatchProductsDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetTransferBatchProductsByIdQuery { TransferBatchProductsId = id });
            if (result.IsSuccess)
                return Ok(result.Data);
            return NotFound(result.ErrorMessage);
        }
    }
}
