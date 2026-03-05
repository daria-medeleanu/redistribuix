using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace RedistribuiXWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestMlController : ControllerBase
    {
        private readonly ISalesForecastService forecastService;

        public TestMlController(ISalesForecastService forecastService)
        {
            this.forecastService = forecastService;
        }

        [HttpGet("test-100-days")]
        public async Task<IActionResult> TestForecast(Guid locationId, Guid productId)
        {
            try
            {
                var forecast = await forecastService.GetSalesForecast100DaysAsync(locationId, productId);

                if (forecast == null)
                {
                    return Ok(new
                    {
                        Message = "Nu s-a putut obține forecast (probabil lipsesc date)",
                        Location = locationId,
                        Product = productId
                    });
                }

                return Ok(new
                {
                    Message = "Succes!",
                    Location = locationId,
                    Product = productId,
                    Forecast100Days = forecast.TotalPredictedQuantity,
                    PredictedDailySales = forecast.PredictedDailySales,
                    DaysOfStockMl = forecast.DaysOfStockMl,
                    StockStatus = forecast.StockStatus
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Eroare la test: {ex.Message}");
            }
        }
    }
}
