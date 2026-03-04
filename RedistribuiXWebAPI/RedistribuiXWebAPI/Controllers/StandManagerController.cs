using Application.Use_Cases.Authentification;
using Application.Use_Cases.Commands.StandManagerCommands;
using Application.Use_Cases.Queries.StandManagerQueries;
using AutoMapper;
using Domain.Common;
using DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class StandManagerController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly string JWT_SECRET;
        private readonly List<string> ALLOW_STANDMANAGER = new() { "StandManager" };

        public StandManagerController(IMediator mediator, IConfiguration configuration)
        {
            this.mediator = mediator;
            this.JWT_SECRET = configuration["Jwt:Key"]!;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStandManagerCommand command)
        {
            var result = await mediator.Send(command);
            if (result.IsSuccess)
                return CreatedAtAction(nameof(GetByID), new { id = result.Data }, new { id = result.Data });
            return BadRequest(result.ErrorMessage);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginCommand command)
        {
            try
            {
                command.Role = "StandManager";
                var token = await mediator.Send(command);
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(Guid id)
        {
            var result = await mediator.Send(new GetStandManagerByIdQuery { Id = id });
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return NotFound(result.ErrorMessage);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StandManagerDto>>> GetAll()
        {
            try
            {
                var standManagers = await mediator.Send(new GetAllStandManagersQuery());
                return Ok(standManagers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateStandManagerCommand command)
        {
            if (id != command.Id)
                return BadRequest("Mismatched StandManager ID.");
            try
            {
                var result = await mediator.Send(command);
                if (result.IsSuccess)
                {
                    return Ok(new { message = "Stand manager updated successfully." });
                }
                return NotFound(result.ErrorMessage);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var result = await mediator.Send(new DeleteStandManagerByIdCommand(id));
                if (result.IsSuccess)
                {
                    return Ok(new { message = "Stand manager deleted successfully." });
                }
                return NotFound(result.ErrorMessage);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
