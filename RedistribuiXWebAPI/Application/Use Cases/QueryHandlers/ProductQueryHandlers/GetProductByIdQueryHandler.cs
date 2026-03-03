using Application.Use_Cases.Queries.ProductQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using DTOs;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers.ProductQueryHandlers
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, Result<ProductDto>>
    {
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;

        public GetProductByIdQueryHandler(IProductRepository productRepository, IMapper mapper)
        {
            this.productRepository = productRepository;
            this.mapper = mapper;
        }

        public async Task<Result<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            var product = await productRepository.GetByIdAsync(request.ProductId);
            if (product == null)
            {
                return Result<ProductDto>.Failure("Product not found");
            }
            var productDto = mapper.Map<ProductDto>(product);
            return Result<ProductDto>.Success(productDto);
        }
    }
}
