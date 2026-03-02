using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class StockVelocityController : ControllerBase
    {
        private readonly IStockVelocityRepository repository;

        public StockVelocityController(IStockVelocityRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockVelocityDto>>> GetAll()
        {
            var entities = await repository.GetAllAsync();
            var dtos = entities.Select(MapToDto).ToList();
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StockVelocityDto>> GetById(Guid id)
        {
            var entity = await repository.GetByIdAsync(id);
            if (entity == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(entity));
        }

        [HttpPost]
        public async Task<ActionResult<StockVelocityDto>> Create([FromBody] StockVelocityDto dto)
        {
            var entity = new StockVelocity
            {
                LocationId = dto.LocationId,
                ProductId = dto.ProductId,
                CurrentQuantity = dto.CurrentQuantity,
                SalesLast30Days = dto.SalesLast30Days,
                SalesLast100Days = dto.SalesLast100Days,
                LastInboundDate = dto.LastInboundDate,
                LastInventoryDate = dto.LastInventoryDate
            };

            entity.RemainingStockDays = CalculateRemainingStockDays(entity.CurrentQuantity, entity.SalesLast100Days);
            entity.StockConfidence = CalculateStockConfidence(entity.LastInventoryDate, DateTime.UtcNow);

            await repository.AddAsync(entity);

            var createdDto = MapToDto(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockVelocityDto dto)
        {
            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.LocationId = dto.LocationId;
            existing.ProductId = dto.ProductId;
            existing.CurrentQuantity = dto.CurrentQuantity;
            existing.SalesLast30Days = dto.SalesLast30Days;
            existing.SalesLast100Days = dto.SalesLast100Days;
            existing.LastInboundDate = dto.LastInboundDate;
            existing.LastInventoryDate = dto.LastInventoryDate;
            existing.RemainingStockDays = CalculateRemainingStockDays(existing.CurrentQuantity, existing.SalesLast100Days);
            existing.StockConfidence = CalculateStockConfidence(existing.LastInventoryDate, DateTime.UtcNow);

            await repository.UpdateAsync(existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            await repository.DeleteAsync(id);
            return NoContent();
        }

        private static StockVelocityDto MapToDto(StockVelocity entity)
        {
            return new StockVelocityDto
            {
                Id = entity.Id,
                LocationId = entity.LocationId,
                ProductId = entity.ProductId,
                CurrentQuantity = entity.CurrentQuantity,
                SalesLast30Days = entity.SalesLast30Days,
                SalesLast100Days = entity.SalesLast100Days,
                LastInboundDate = entity.LastInboundDate,
                LastInventoryDate = entity.LastInventoryDate,
                RemainingStockDays = entity.RemainingStockDays,
                StockConfidence = entity.StockConfidence
            };
        }

        private static decimal CalculateRemainingStockDays(int currentQuantity, int salesLast100Days)
        {
            if (salesLast100Days <= 0)
            {
                return 0;
            }

            var dailyAverage = salesLast100Days / 100m;
            if (dailyAverage <= 0)
            {
                return 0;
            }

            return Math.Round(currentQuantity / dailyAverage, 2);
        }

        private static StockConfidence CalculateStockConfidence(DateTime lastInventoryDate, DateTime nowUtc)
        {
            var daysSinceInventory = (nowUtc.Date - lastInventoryDate.Date).TotalDays;

            if (daysSinceInventory < 30)
            {
                return StockConfidence.High;
            }

            if (daysSinceInventory <= 60)
            {
                return StockConfidence.Medium;
            }

            return StockConfidence.Low;
        }
    }
}
