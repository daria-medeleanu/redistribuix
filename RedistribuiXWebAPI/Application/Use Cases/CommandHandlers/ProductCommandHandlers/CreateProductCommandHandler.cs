using Application.Use_Cases.Commands.ProductCommands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.ProductCommandHandlers
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IProductRepository repository;
        private readonly IMapper mapper;

        public CreateProductCommandHandler(IProductRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var product = mapper.Map<Product>(request);
            await repository.AddAsync(product);
            return product.ProductId;
        }
    }
}
