using AutoMapper;
using Domain.Entities;
using DTOs;
using Application.Use_Cases.Commands.AdminCommands;
using Application.Use_Cases.Commands.StandManagerCommands;
using Application.Use_Cases.Commands.LocationCommands;
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
            /*CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CreateProductCommand, Product>().ReverseMap();
            CreateMap<UpdateProductCommand, Product>().ReverseMap();
            CreateMap<PhoneModel, PhoneModelDto>().ReverseMap();
            CreateMap<CreatePhoneModelCommand, PhoneModel>().ReverseMap();
            CreateMap<UpdatePhoneModelCommand, PhoneModel>().ReverseMap();*/

        }
    }
}
