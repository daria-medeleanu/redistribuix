using Application.Use_Cases.Commands.TransportCostCommands;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransportCostCommandHandlers
{
    public class DeleteTransportCostCommandHandler : IRequestHandler<DeleteTransportCostCommand, bool>
    {
        private readonly ITransportCostRepository repository;

        public DeleteTransportCostCommandHandler(ITransportCostRepository repository)
        {
            this.repository = repository;
        }

        public async Task<bool> Handle(DeleteTransportCostCommand request, CancellationToken cancellationToken)
        {
            var transportCost = await repository.GetByIdAsync(request.TransportCostId);
            if (transportCost == null)
                return false;

            await repository.DeleteAsync(request.TransportCostId);
            return true;
        }
    }
}
