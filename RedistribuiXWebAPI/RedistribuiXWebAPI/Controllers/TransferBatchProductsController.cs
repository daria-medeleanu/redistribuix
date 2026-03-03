using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace RedistribuiXWebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TransferBatchProductsController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly string JWT_SECRET;
        private readonly List<string> ALLOW_ADMIN = new() { "Admin" };

        public TransferBatchProductsController(IMediator mediator, IConfiguration configuration)
        {
            this.mediator = mediator;
            this.JWT_SECRET = configuration["Jwt:Key"]!;
        }
    }
}
