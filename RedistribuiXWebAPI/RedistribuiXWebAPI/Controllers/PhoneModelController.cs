using Application.Use_Cases.Commands.PhoneModelCommands;
using Application.Use_Cases.Queries.PhoneModelQueries;
using AutoMapper;
using DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PhoneModelController : ControllerBase
    {
        private readonly IMediator mediator;

        public PhoneModelController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePhoneModelCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePhoneModelCommand command)
        {
            if (id != command.ModelId)
                return BadRequest("Mismatched ModelId.");

            var result = await mediator.Send(command);
            if (result)
                return Ok(new { message = "Phone model updated successfully." });
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await mediator.Send(new DeletePhoneModelCommand { ModelId = id });
            if (result)
                return Ok(new { message = "Phone model deleted successfully." });
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PhoneModelDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetPhoneModelByIdQuery { ModelId = id });
            if (result.IsSuccess)
                return Ok(result.Data);
            return NotFound(result.ErrorMessage);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhoneModelDto>>> GetAll()
        {
            var phoneModels = await mediator.Send(new GetAllPhoneModelsQuery());
            return Ok(phoneModels);
        }
    }
}
