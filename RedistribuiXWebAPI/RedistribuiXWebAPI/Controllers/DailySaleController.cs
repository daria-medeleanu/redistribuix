using Application.Use_Cases.Commands.DailySaleCommands;
using Application.Use_Cases.Queries.DailySaleQueries;
using Domain.Common;
using Domain.Entities;
using DTOs;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DailySaleController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ApplicationDbContext _context;

        public DailySaleController(IMediator mediator, ApplicationDbContext _context)
        {
            this.mediator = mediator;
            this._context = _context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DailySaleDto>>> GetAll()
        {
            var dtos = await mediator.Send(new GetAllDailySalesQuery());
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DailySaleDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetDailySaleByIdQuery { Id = id });
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDailySaleCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Data }, new { id = result.Data });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDailySaleCommand command)
        {
            if (id != command.Id)
            {
                command.Id = id;
            }

            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await mediator.Send(new DeleteDailySaleByIdCommand(id));
            if (!result.IsSuccess)
            {
                return NotFound(result.ErrorMessage);
            }

            return NoContent();
        }
        [HttpGet("summary")]
        [HttpGet("summary/{locationId}")]
        public async Task<ActionResult> GetSummary(Guid? locationId)
        {
            var query = _context.DailySales.AsQueryable();
            if (locationId.HasValue)
                query = query.Where(s => s.LocationId == locationId.Value);

            var summary = await query
                .GroupBy(s => s.SaleDate.Date)
                .Select(g => new { SaleDate = g.Key, ItemsCount = g.Count() })
                .ToListAsync();

            return Ok(summary);
        }

        [HttpGet("by-date")]
        [HttpGet("by-date/{locationId}")]
        public async Task<ActionResult> GetByDate([FromQuery] string date, Guid? locationId)
        {
            var parsedDate = DateTime.SpecifyKind(DateTime.Parse(date).Date, DateTimeKind.Utc);

            var query = _context.DailySales.Where(s => s.SaleDate.Date == parsedDate);

            if (locationId.HasValue)
                query = query.Where(s => s.LocationId == locationId.Value);

            return Ok(await query.ToListAsync());
        }

        [HttpPost("generate-mock-data")]
        public async Task<ActionResult> GenerateMockData([FromQuery] Guid locationId, [FromQuery] Guid productId)
        {
            var random = new Random();
            var salesToAdd = new List<DailySale>();
            int totalUnitsSold = 0;

            // Gener?m date pentru ultimele 29 de zile (excluzând ziua de azi)
            for (int i = 29; i >= 1; i--)
            {
                // Set?m data ?i o for??m ca UTC pentru PostgreSQL
                var date = DateTime.SpecifyKind(DateTime.UtcNow.AddDays(-i), DateTimeKind.Utc);

                // Simulam c? în unele zile nu s-a vândut nimic (20% ?anse)
                if (random.Next(0, 100) < 20) continue;

                // Cre?m între 1 ?i 3 tranzac?ii separate pe zi
                int transactionsPerDay = random.Next(1, 4);

                for (int j = 0; j < transactionsPerDay; j++)
                {
                    // Ad?ug?m o or? aleatoare tranzac?iei în timpul zilei de lucru (10:00 - 18:00)
                    var saleTime = date.AddHours(random.Next(10, 18)).AddMinutes(random.Next(0, 60));
                    int qty = random.Next(1, 4); // Se vând între 1 ?i 3 buc??i pe bon

                    totalUnitsSold += qty;

                    salesToAdd.Add(new DailySale
                    {
                        Id = Guid.NewGuid(),
                        LocationId = locationId,
                        ProductId = productId,
                        SaleDate = saleTime,
                        QuantitySold = qty
                    });
                }
            }

            _context.DailySales.AddRange(salesToAdd);

            var stock = await _context.StockVelocities
                .FirstOrDefaultAsync(s => s.LocationId == locationId && s.ProductId == productId);

            if (stock != null)
            {
                stock.SalesLast30Days += totalUnitsSold;
                stock.SalesLast100Days += totalUnitsSold;
                stock.CurrentQuantity = Math.Max(0, stock.CurrentQuantity - totalUnitsSold);

                // --- AICI ESTE PARTEA ADAUGATA ---
                // Recalcul?m media de vânz?ri zilnice (bazat pe ultimele 30 de zile)
                double dailySalesRate = stock.SalesLast30Days / 30.0;

                // Evit?m împ?r?irea la zero
                if (dailySalesRate > 0)
                {
                    // Calcul?m câte zile va mai ajunge stocul
                    stock.RemainingStockDays = (int)Math.Round(stock.CurrentQuantity / dailySalesRate);
                }
                else
                {
                    // Dac? nu s-a vândut nimic, stocul este suficient teoretic la nesfâr?it
                    stock.RemainingStockDays = 999;
                }
                // ---------------------------------
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Mock data generated successfully!",
                TransactionsCreated = salesToAdd.Count,
                TotalUnitsSold = totalUnitsSold
            });
        }
    }
}
