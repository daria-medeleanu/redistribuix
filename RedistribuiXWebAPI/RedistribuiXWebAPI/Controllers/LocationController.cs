using Application.Use_Cases.Commands.LocationCommands;
using Application.Use_Cases.Queries.LocationQueries;
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
    public class LocationController : ControllerBase
    {
        private readonly IMediator mediator;

        public LocationController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLocationCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLocationCommand command)
        {
            if (id != command.LocationId)
                return BadRequest("Mismatched LocationId.");

            var result = await mediator.Send(command);
            if (result)
                return Ok(new { message = "Location updated successfully." });
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await mediator.Send(new DeleteLocationCommand { LocationId = id });
            if (result)
                return Ok(new { message = "Location deleted successfully." });
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LocationDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetLocationByIdQuery { LocationId = id });
            if (result.IsSuccess)
                return Ok(result.Data);
            return NotFound(result.ErrorMessage);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocationDto>>> GetAll()
        {
            var locations = await mediator.Send(new GetAllLocationsQuery());
            return Ok(locations);
        }
    }
}
