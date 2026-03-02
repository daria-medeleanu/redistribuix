using Domain.Entities;
using Domain.Repositories;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DailySaleController : ControllerBase
    {
        private readonly IDailySaleRepository repository;

        public DailySaleController(IDailySaleRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DailySaleDto>>> GetAll()
        {
            var entities = await repository.GetAllAsync();
            var dtos = entities.Select(MapToDto).ToList();
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DailySaleDto>> GetById(int id)
        {
            var entity = await repository.GetByIdAsync(id);
            if (entity == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(entity));
        }

        [HttpPost]
        public async Task<ActionResult<DailySaleDto>> Create([FromBody] DailySaleDto dto)
        {
            var entity = new DailySale
            {
                LocationId = dto.LocationId,
                ProductId = dto.ProductId,
                SaleDate = dto.SaleDate,
                QuantitySold = dto.QuantitySold
            };

            await repository.AddAsync(entity);

            var createdDto = MapToDto(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DailySaleDto dto)
        {
            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.LocationId = dto.LocationId;
            existing.ProductId = dto.ProductId;
            existing.SaleDate = dto.SaleDate;
            existing.QuantitySold = dto.QuantitySold;

            await repository.UpdateAsync(existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            await repository.DeleteAsync(id);
            return NoContent();
        }

        private static DailySaleDto MapToDto(DailySale entity)
        {
            return new DailySaleDto
            {
                Id = entity.Id,
                LocationId = entity.LocationId,
                ProductId = entity.ProductId,
                SaleDate = entity.SaleDate,
                QuantitySold = entity.QuantitySold
            };
        }
    }
}
