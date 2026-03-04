namespace Application.Services
{
    public interface ISalesForecastService
    {
        Task<int> GetSalesForecast100DaysAsync(Guid locationId, Guid productId);
    }
}