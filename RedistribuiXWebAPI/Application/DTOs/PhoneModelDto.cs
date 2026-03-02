using Domain.Enums;

namespace DTOs
{
    public class PhoneModelDto
    {
        public Guid ModelId { get; set; }
        public string ModelName { get; set; }
        public LifeStatus LifeStatus { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}
