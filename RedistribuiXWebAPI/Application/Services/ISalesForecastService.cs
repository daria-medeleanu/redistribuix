namespace Application.Services
{
    public interface ISalesForecastService
    {
        Task<SalesForecastDto?> GetSalesForecast100DaysAsync(Guid locationId, Guid productId);
    }

    // DTO simplu, folosit de Application și de controllere
    public class SalesForecastDto
    {
        public string LocationId { get; set; }

        public string ProductId { get; set; }

        public int ForecastHorizonDays { get; set; }

        public int TotalPredictedQuantity { get; set; }

        public double PredictedDailySales { get; set; }

        public double DaysOfStockMl { get; set; }

        public string StockStatus { get; set; }
    }
}