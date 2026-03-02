using MediatR;
using System.Collections.Generic;
using Domain.Entities;
using DTOs;

namespace Application.Use_Cases.Queries.AdminQueries
{
    public class GetAllAdminsQuery : IRequest<List<AdminDto>>
    {
    }
}
