using Application.Use_Cases.Commands.DailySaleCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.DailySaleCommandHandlers
{
    public class CreateDailySaleCommandHandler : IRequestHandler<CreateDailySaleCommand, Result<Guid>>
    {
        private readonly IDailySaleRepository repository;
        private readonly IMapper mapper;

        public CreateDailySaleCommandHandler(IDailySaleRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<Guid>> Handle(CreateDailySaleCommand request, CancellationToken cancellationToken)
        {
            var entity = mapper.Map<DailySale>(request);

            await repository.AddAsync(entity);

            return Result<Guid>.Success(entity.Id);
        }
    }
}
