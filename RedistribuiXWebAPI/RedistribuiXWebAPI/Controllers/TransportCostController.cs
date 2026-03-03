using Application.Use_Cases.Authentification;
using Application.Use_Cases.Commands.AdminCommands;
using Application.Use_Cases.Queries.AdminQueries;
using DTOs;
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
        
    }
}
