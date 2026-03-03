using Application.Use_Cases.Commands.PhoneModelCommands;
using AutoMapper;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.PhoneModelCommandHandlers
{
    public class UpdatePhoneModelCommandHandler : IRequestHandler<UpdatePhoneModelCommand, bool>
    {
        private readonly IPhoneModelRepository repository;
        private readonly IMapper mapper;

        public UpdatePhoneModelCommandHandler(IPhoneModelRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdatePhoneModelCommand request, CancellationToken cancellationToken)
        {
            var phoneModel = await repository.GetByIdAsync(request.ModelId);
            if (phoneModel == null)
                return false;

            mapper.Map(request, phoneModel);
            await repository.UpdateAsync(phoneModel);
            return true;
        }
    }
}
