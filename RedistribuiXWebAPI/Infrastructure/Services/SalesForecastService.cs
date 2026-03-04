using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using System.Text.Json.Serialization;
using Application.Services;

namespace Infrastructure.Services
{
    public class MlForecastRequest
    {
        [JsonPropertyName("location_id")]
        public string LocationId { get; set; }

        [JsonPropertyName("product_id")]
        public string ProductId { get; set; }

        [JsonPropertyName("start_date")]
        public string StartDate { get; set; }

        [JsonPropertyName("recent_sales_30_days")]
        public List<float> RecentSales30Days { get; set; }

        [JsonPropertyName("forecast_horizon")]
        public int ForecastHorizon { get; set; } = 100;

        [JsonPropertyName("profile_type_encoded")]
        public int ProfileTypeEncoded { get; set; }

        [JsonPropertyName("purchasing_power_encoded")]
        public int PurchasingPowerEncoded { get; set; }
    }

    // 2. Clasa "răspunsului" primit de la Python
    public class MlForecastResponse
    {
        [JsonPropertyName("location_id")]
        public string LocationId { get; set; }

        [JsonPropertyName("product_id")]
        public string ProductId { get; set; }

        [JsonPropertyName("forecast_horizon_days")]
        public int ForecastHorizonDays { get; set; }

        [JsonPropertyName("total_predicted_quantity")]
        public int TotalPredictedQuantity { get; set; }
    }

    // 3. Serviciul principal
    public class SalesForecastService : ISalesForecastService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public SalesForecastService(ApplicationDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
            // Setăm adresa de bază către Python
            _httpClient.BaseAddress = new Uri("http://127.0.0.1:8000/");
        }

        public async Task<int> GetSalesForecast100DaysAsync(Guid locationId, Guid productId)
        {
            // Luăm data de azi (UTC, fără ore)
            DateTime today = DateTime.UtcNow.Date;
            DateTime thirtyDaysAgo = today.AddDays(-30);

            // --- ADĂUGAT: Aducem și detaliile locației din DB pentru a le trimite la model ---
            var location = await _context.Locations.FindAsync(locationId);

            // 1. Aducem vânzările din baza de date doar pe ultimele 30 de zile
            var rawSales = await _context.DailySales
                .Where(ds => ds.LocationId == locationId
                          && ds.ProductId == productId
                          && ds.SaleDate >= thirtyDaysAgo
                          && ds.SaleDate < today)
                .ToListAsync();

            // 2. Construim o listă perfectă de 30 de zile. 
            // Dacă ai o zi în care nu s-a vândut nimic (nu e rând în DB), îi punem noi 0.
            var recentSales30Days = new List<float>();

            for (int i = 30; i >= 1; i--)
            {
                DateTime targetDay = today.AddDays(-i);
                var saleForDay = rawSales.FirstOrDefault(s => s.SaleDate.Date == targetDay);

                recentSales30Days.Add(saleForDay != null ? (float)saleForDay.QuantitySold : 0f);
            }

            // 3. Pregătim request-ul. Aici .ToString("yyyy-MM-dd") taie coada aia enervantă!
            var request = new MlForecastRequest
            {
                LocationId = locationId.ToString(),
                ProductId = productId.ToString(),
                StartDate = today.ToString("yyyy-MM-dd"), // Formatul perfect!
                RecentSales30Days = recentSales30Days,
                ForecastHorizon = 100,

                // --- ADĂUGAT: Mapăm Enum-urile locației la int (așa cum le așteaptă Python) ---
                ProfileTypeEncoded = (int)(location?.Profile ?? 0),
                PurchasingPowerEncoded = (int)(location?.PurchasingPower ?? 0)
            };

            try
            {
                // 4. Facem POST către Python API
                var response = await _httpClient.PostAsJsonAsync("forecast", request);
                response.EnsureSuccessStatusCode(); // Aruncă excepție dacă statusul nu e 2xx

                var result = await response.Content.ReadFromJsonAsync<MlForecastResponse>();
                return result?.TotalPredictedQuantity ?? 0;
            }
            catch (Exception ex)
            {
                // Logăm eroarea și returnăm 0 ca să nu dărâmăm aplicația
                Console.WriteLine($"[Eroare ML API]: {ex.Message}");
                return 0;
            }
        }
    }
}