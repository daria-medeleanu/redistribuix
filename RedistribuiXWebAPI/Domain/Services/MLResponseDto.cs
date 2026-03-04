namespace Domain.Services
{
    public class MLResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public Guid Location { get; set; }
        public Guid Product { get; set; }
        public int Forecast100Days { get; set; }
    }
}
