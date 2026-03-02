using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class PhoneModel
    {
        public Guid ModelId { get; set; }
        public required string ModelName { get; set; }
        public LifeStatus LifeStatus { get; set; }

        public DateTime ReleaseDate { get; set; }
        public PhoneModel()
        {
            ModelId = Guid.NewGuid();
        }
    }
}
