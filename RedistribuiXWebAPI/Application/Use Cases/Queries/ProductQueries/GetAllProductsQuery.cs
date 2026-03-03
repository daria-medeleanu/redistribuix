using DTOs;
using MediatR;
using System.Collections.Generic;

namespace Application.Use_Cases.Queries.ProductQueries
{
    public class GetAllProductsQuery : IRequest<List<ProductDto>>
    {
    }
}
