using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class StandManager : User
    {
        public Guid LocationId { get; set; }
        public virtual Location Location { get; set; }

        public StandManager()
        {
            Id = Guid.NewGuid();
        }
    }
}
