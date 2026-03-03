using Application.Use_Cases.Commands.PhoneModelCommands;
using AutoMapper;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.PhoneModelCommandHandlers
{
    public class DeletePhoneModelCommandHandler : IRequestHandler<DeletePhoneModelCommand, bool>
    {
        private readonly IPhoneModelRepository repository;
        private readonly IMapper mapper;

        public DeletePhoneModelCommandHandler(IPhoneModelRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(DeletePhoneModelCommand request, CancellationToken cancellationToken)
        {
            var phoneModel = await repository.GetByIdAsync(request.ModelId);
            if (phoneModel == null)
                return false;

            await repository.DeleteAsync(request.ModelId);
            return true;
        }
    }
}
