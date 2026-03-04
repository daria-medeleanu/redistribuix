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
                int predictedQty = await forecastService.GetSalesForecast100DaysAsync(locationId, productId);

                return Ok(new
                {
                    Message = "Succes!",
                    Location = locationId,
                    Product = productId,
                    Forecast100Days = predictedQty
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Eroare la test: {ex.Message}");
            }
        }
    }
}
