using Application.DTOs;
using Application.Use_Cases.Commands.AdminCommands;
using Application.Use_Cases.Commands.StandManagerCommands;
using Application.Use_Cases.Commands.LocationCommands;
using Application.Use_Cases.Commands.CalendarEventCommands;
using Application.Use_Cases.Commands.DailySaleCommands;
using Application.Use_Cases.Commands.StockVelocityCommands;
using Application.Use_Cases.Commands.ProductCommands;
using Application.Use_Cases.Commands.PhoneModelCommands;
namespace Application.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Admin, AdminDto>().ReverseMap();
            CreateMap<CreateAdminCommand, Admin>().ReverseMap();
            CreateMap<UpdateAdminCommand, Admin>().ReverseMap();
            CreateMap<StandManager, StandManagerDto>().ReverseMap();
            CreateMap<CreateStandManagerCommand, StandManager>().ReverseMap();
            CreateMap<UpdateStandManagerCommand, StandManager>().ReverseMap();
            
            CreateMap<Location, LocationDto>().ReverseMap();
            CreateMap<CreateLocationCommand, Location>().ReverseMap();
            CreateMap<UpdateLocationCommand, Location>().ReverseMap();
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CreateProductCommand, Product>().ReverseMap();
            CreateMap<UpdateProductCommand, Product>().ReverseMap();
            CreateMap<PhoneModel, PhoneModelDto>().ReverseMap();
            CreateMap<CreatePhoneModelCommand, PhoneModel>().ReverseMap();
            CreateMap<UpdatePhoneModelCommand, PhoneModel>().ReverseMap();
            CreateMap<CalendarEvent, CalendarEventDto>().ReverseMap();
            CreateMap<CreateCalendarEventCommand, CalendarEvent>().ReverseMap();
            CreateMap<UpdateCalendarEventCommand, CalendarEvent>().ReverseMap();

            CreateMap<DailySale, DailySaleDto>().ReverseMap();
            CreateMap<CreateDailySaleCommand, DailySale>().ReverseMap();
            CreateMap<UpdateDailySaleCommand, DailySale>().ReverseMap();

            CreateMap<StockVelocity, StockVelocityDto>().ReverseMap();
            CreateMap<CreateStockVelocityCommand, StockVelocity>().ReverseMap();
            CreateMap<UpdateStockVelocityCommand, StockVelocity>().ReverseMap();
           
            CreateMap<TransportCost, TransportCostDto>().ReverseMap();
            CreateMap<TransportBatch, TransportBatchDto>().ReverseMap();
            CreateMap<TransportBatchProducts, TransportBatchProductsDto>().ReverseMap();

        }
    }
}
