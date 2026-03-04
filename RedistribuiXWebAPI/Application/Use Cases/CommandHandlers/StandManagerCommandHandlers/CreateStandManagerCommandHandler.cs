using Application.Use_Cases.Commands.StandManagerCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Domain.Services;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.StandManagerCommandHandlers
{
    public class CreateStandManagerCommandHandler : IRequestHandler<CreateStandManagerCommand, Result<Guid>>
    {
        private readonly IStandManagerRepository repository;
        private readonly IMapper mapper;

        public CreateStandManagerCommandHandler(IStandManagerRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<Guid>> Handle(CreateStandManagerCommand request, CancellationToken cancellationToken)
        {
            var standManager = mapper.Map<StandManager>(request);
            standManager.PasswordHash = PasswordHasher.HashPassword(request.Password);
            var result = await repository.AddAsync(standManager);
            if (result.IsSuccess)
            {
                return Result<Guid>.Success(result.Data);
            }
            return Result<Guid>.Failure(result.ErrorMessage);
        }
    }
}
