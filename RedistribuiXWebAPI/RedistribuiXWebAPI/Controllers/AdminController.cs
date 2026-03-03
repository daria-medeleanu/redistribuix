using Application.Use_Cases.Authentification;
using Application.Use_Cases.Commands.AdminCommands;
using Application.Use_Cases.Queries.AdminQueries;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
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
    public class AdminController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly string JWT_SECRET;
        private readonly List<string> ALLOW_ADMIN = new() { "Admin" };

        public AdminController(IMediator mediator, IConfiguration configuration)
        {
            this.mediator = mediator;
            this.JWT_SECRET = configuration["Jwt:Key"]!;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminCommand command)
        {
            var result = await mediator.Send(command);
            if (result.IsSuccess)
                return CreatedAtAction(nameof(GetByID), new { id = result.Data }, new { id = result.Data }); // returns { "id": "..." }
            return BadRequest(result.ErrorMessage);
        }



        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginCommand command)
        {
            try
            {
                command.Role = "Admin";
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
            var result = await mediator.Send(new GetAdminByIdQuery { Id = id });
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return NotFound(result.ErrorMessage);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminDto>>> GetAll()
        {
            try
            {
                var admins = await mediator.Send(new GetAllAdminsQuery());
                return Ok(admins);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAdminCommand command)
        {
            if (id != command.Id)
                return BadRequest("Mismatched Admin ID.");
            try
            {
                var result = await mediator.Send(command);
                if (result.IsSuccess)
                {
                    return Ok(new { message = "Admin updated successfully." });
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
                var result = await mediator.Send(new DeleteAdminByIdCommand(id));
                if (result.IsSuccess)
                {
                    return Ok(new { message = "Admin deleted successfully." });
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
