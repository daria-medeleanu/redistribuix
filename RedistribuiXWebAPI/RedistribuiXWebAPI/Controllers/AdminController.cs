using Application.Use_Cases.Authentification;
using Application.Use_Cases.Commands.AdminCommands;
using Domain.Common;
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
        public async Task<ActionResult<Result<Unit>>> CreateAdmin([FromBody] CreateAdminCommand command)
        {
            var result = await mediator.Send(command);
            if (result.IsSuccess)
                return Ok(result.Data);
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
        /*
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(Guid id)
        {
            var authHeader = Request.Headers.Authorization.ToString();
            var authStatus = IAuthorizationManager.EnsureProperAuthorization(authHeader, JWT_SECRET, id, ALLOW_ADMIN);
            if (!authStatus.IsSuccess)
            {
                return Unauthorized(authStatus.ErrorMessage);
            }
            // Add logic to get admin by id if needed
            return Ok();
        }*/
    }
}
