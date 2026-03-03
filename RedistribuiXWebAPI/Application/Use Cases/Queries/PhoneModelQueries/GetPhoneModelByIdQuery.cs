using Domain.Common;
using DTOs;
using MediatR;
using System;

namespace Application.Use_Cases.Queries.PhoneModelQueries
{
    public class GetPhoneModelByIdQuery : IRequest<Result<PhoneModelDto>>
    {
        public Guid ModelId { get; set; }
    }
}
