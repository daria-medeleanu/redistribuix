using Application.Use_Cases.Commands.ProductCommands;
using AutoMapper;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.ProductCommandHandlers
{
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
    {
        private readonly IProductRepository repository;
        private readonly IMapper mapper;

        public UpdateProductCommandHandler(IProductRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await repository.GetByIdAsync(request.ProductId);
            if (product == null)
                return false;

            mapper.Map(request, product);
            await repository.UpdateAsync(product);
            return true;
        }
    }
}
