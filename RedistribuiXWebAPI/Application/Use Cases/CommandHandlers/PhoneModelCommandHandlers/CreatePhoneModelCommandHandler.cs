using Application.Use_Cases.Commands.PhoneModelCommands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.PhoneModelCommandHandlers
{
    public class CreatePhoneModelCommandHandler : IRequestHandler<CreatePhoneModelCommand, Guid>
    {
        private readonly IPhoneModelRepository repository;
        private readonly IMapper mapper;

        public CreatePhoneModelCommandHandler(IPhoneModelRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Guid> Handle(CreatePhoneModelCommand request, CancellationToken cancellationToken)
        {
            var phoneModel = mapper.Map<PhoneModel>(request);
            await repository.AddAsync(phoneModel);
            return phoneModel.ModelId;
        }
    }
}
