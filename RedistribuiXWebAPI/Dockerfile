# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and restore
COPY RedistribuiXWebAPI.sln ./
COPY Domain/Domain.csproj Domain/
COPY Application/Application.csproj Application/
COPY Infrastructure/Infrastructure.csproj Infrastructure/
COPY RedistribuiXWebAPI/RedistribuiXWebAPI.csproj RedistribuiXWebAPI/
RUN dotnet restore

# Copy all and build
COPY . .
RUN dotnet publish RedistribuiXWebAPI/RedistribuiXWebAPI.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5056
EXPOSE 5056

ENTRYPOINT ["dotnet", "RedistribuiXWebAPI.dll"]
