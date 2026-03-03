using Application.DTOs;
using Application.Use_Cases.Commands.AdminCommands;
using Application.Use_Cases.Commands.CalendarEventCommands;
using Application.Use_Cases.Commands.DailySaleCommands;
using Application.Use_Cases.Commands.LocationCommands;
using Application.Use_Cases.Commands.PhoneModelCommands;
using Application.Use_Cases.Commands.ProductCommands;
using Application.Use_Cases.Commands.StandManagerCommands;
using Application.Use_Cases.Commands.StockVelocityCommands;
using Application.Use_Cases.Commands.TransferBatchCommands;
using Application.Use_Cases.Commands.TransferBatchProductsCommands;
using Application.Use_Cases.Commands.TransportCostCommands;
using AutoMapper;
using Domain.Entities;
using DTOs;

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
            CreateMap<CreateTransportCostCommand, TransportCost>().ReverseMap();
            CreateMap<UpdateTransportCostCommand, TransportCost>().ReverseMap();

            CreateMap<TransferBatch, TransferBatchDto>().ReverseMap();
            CreateMap<CreateTransferBatchCommand, TransferBatch>().ReverseMap();
            CreateMap<UpdateTransferBatchCommand, TransferBatch>().ReverseMap();
            
            CreateMap<TransferBatchProducts, TransferBatchProductsDto>().ReverseMap();
            CreateMap<CreateTransferBatchProductsCommand, TransferBatchProducts>().ReverseMap();
            CreateMap<UpdateTransferBatchProductsCommand, TransferBatchProducts>().ReverseMap();
        }
    }
}
