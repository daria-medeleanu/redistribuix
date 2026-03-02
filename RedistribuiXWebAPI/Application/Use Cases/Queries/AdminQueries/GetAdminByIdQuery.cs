using Domain.Common;
using Domain.Entities;
using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.AdminQueries
{
    public class GetAdminByIdQuery : IRequest<Result<AdminDto>>
    {
        public Guid Id { get; set; }
    }
}
