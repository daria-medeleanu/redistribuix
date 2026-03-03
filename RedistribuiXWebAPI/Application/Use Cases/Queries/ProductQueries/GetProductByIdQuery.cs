using Domain.Common;
using DTOs;
using MediatR;
using System;

namespace Application.Use_Cases.Queries.ProductQueries
{
    public class GetProductByIdQuery : IRequest<Result<ProductDto>>
    {
        public Guid ProductId { get; set; }
    }
}
