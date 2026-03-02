namespace DTOs
{
    public class StandManagerDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public Guid LocationId { get; set; }
    }
}
