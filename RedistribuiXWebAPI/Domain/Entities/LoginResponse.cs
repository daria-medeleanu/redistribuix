using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class LoginResponse
    {
        public required string Token { get; set; }
        public required string Role { get; set; }
        public Guid Id { get; set; }

    }
}
