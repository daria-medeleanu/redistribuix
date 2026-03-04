using DTOs;
using MediatR;
using System.Collections.Generic;

namespace Application.Use_Cases.Queries.StandManagerQueries
{
    public class GetAllStandManagersQuery : IRequest<List<StandManagerDto>>
    {
    }
}
