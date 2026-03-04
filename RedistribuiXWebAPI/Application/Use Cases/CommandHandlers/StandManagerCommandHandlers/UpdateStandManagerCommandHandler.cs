using Application.Use_Cases.Commands.StandManagerCommands;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.StandManagerCommandHandlers
{
    public class UpdateStandManagerCommandHandler : IRequestHandler<UpdateStandManagerCommand, Result<Guid>>
    {
        private readonly IStandManagerRepository repository;
        private readonly IMapper mapper;

        public UpdateStandManagerCommandHandler(IStandManagerRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<Guid>> Handle(UpdateStandManagerCommand request, CancellationToken cancellationToken)
        {
            var standManager = await repository.GetByIdAsync(request.Id);
            if (standManager == null)
            {
                return Result<Guid>.Failure("StandManager not found");
            }

            // Map updated fields from request to the existing entity
            mapper.Map(request, standManager);

            await repository.UpdateAsync(standManager);
            return Result<Guid>.Success(standManager.Id);
        }
    }
}
