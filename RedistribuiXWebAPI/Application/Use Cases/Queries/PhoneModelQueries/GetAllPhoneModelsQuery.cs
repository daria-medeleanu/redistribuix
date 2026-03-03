using DTOs;
using MediatR;
using System.Collections.Generic;

namespace Application.Use_Cases.Queries.PhoneModelQueries
{
    public class GetAllPhoneModelsQuery : IRequest<List<PhoneModelDto>>
    {
    }
}
