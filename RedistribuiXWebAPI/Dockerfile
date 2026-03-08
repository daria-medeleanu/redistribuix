# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy everything and restore
COPY . .
RUN dotnet restore "RedistribuiXWebAPI/RedistribuiXWebAPI.csproj"

# Publish
RUN dotnet publish "RedistribuiXWebAPI/RedistribuiXWebAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5056
EXPOSE 5056

ENTRYPOINT ["dotnet", "RedistribuiXWebAPI.dll"]
