using Application.Use_Cases.Commands.ProductCommands;
using Application.Use_Cases.Queries.ProductQueries;
using AutoMapper;
using DTOs;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Enums;

namespace WebAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ApplicationDbContext _context;


        public ProductController(IMediator mediator, ApplicationDbContext context)
        {
            this.mediator = mediator;
            this._context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductCommand command)
        {
            if (id != command.ProductId)
                return BadRequest("Mismatched ProductId.");

            var result = await mediator.Send(command);
            if (result)
                return Ok(new { message = "Product updated successfully." });
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await mediator.Send(new DeleteProductCommand { ProductId = id });
            if (result)
                return Ok(new { message = "Product deleted successfully." });
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(Guid id)
        {
            var result = await mediator.Send(new GetProductByIdQuery { ProductId = id });
            if (result.IsSuccess)
                return Ok(result.Data);
            return NotFound(result.ErrorMessage);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            var products = await mediator.Send(new GetAllProductsQuery());
            return Ok(products);
        }

        [HttpGet("categories")]
        public ActionResult<IEnumerable<string>> GetCategories()
        {
            var categories = Enum.GetNames(typeof(ProductCategory));
            return Ok(categories);
        }
        [HttpGet("by-location/{locationId:guid}")]

        public async Task<IActionResult> GetProductsByLocation(Guid locationId)
        {
            var products = await _context.Products
                .Where(p => _context.StockVelocities.Any(sv => sv.LocationId == locationId && sv.ProductId == p.ProductId))
                .ToListAsync();

            return Ok(products);
        }
    }
}