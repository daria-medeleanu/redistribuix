using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Domain.Entities;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<StandManager> StandManagers { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<PhoneModel> PhoneModels { get; set; }
        public DbSet<StockVelocity> StockVelocities { get; set; }
        public DbSet<DailySale> DailySales { get; set; }
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        // Add other DbSets as needed

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.ToTable("Admins");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
                // Add other properties as needed
            });

            modelBuilder.Entity<StandManager>(entity =>
            {
                entity.ToTable("StandManagers");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.LocationId).IsRequired();
                entity.HasOne(e => e.Location)
                      .WithMany()
                      .HasForeignKey(e => e.LocationId);
                // Add other properties as needed
            });

            modelBuilder.Entity<Location>(entity =>
            {
                entity.ToTable("Locations");
                entity.HasKey(e => e.LocationId);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Profile)
                      .IsRequired()
                      .HasConversion<string>();
                entity.Property(e => e.PurchasingPower)
                      .IsRequired()
                      .HasConversion<string>();
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products");
                entity.HasKey(e => e.ProductId);
                entity.Property(e => e.ProductId).ValueGeneratedOnAdd();

                entity.Property(e => e.Sku)
                    .IsRequired();

                entity.Property(e => e.Name)
                    .IsRequired();

                entity.Property(e => e.Category)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(e => e.PhoneModelId)
                    .IsRequired(false);

                entity.Property(e => e.SalePrice)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(e => e.PurchasePrice)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.HasOne(e => e.PhoneModel)
                    .WithMany()
                    .HasForeignKey(e => e.PhoneModelId)
                    .OnDelete(DeleteBehavior.SetNull);
            });


            modelBuilder.Entity<PhoneModel>(entity =>
           {
               entity.ToTable("PhoneModels");
               entity.HasKey(e => e.ModelId);
               entity.Property(e => e.ModelId)
                   .ValueGeneratedOnAdd();

               entity.Property(e => e.ModelName)
                   .IsRequired();

               entity.Property(e => e.LifeStatus)
                   .IsRequired()
                   .HasConversion<string>();

               entity.Property(e => e.ReleaseDate)
                   .IsRequired();
           });

            modelBuilder.Entity<StockVelocity>(entity =>
            {
                entity.ToTable("StockVelocities");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.CurrentQuantity)
                    .IsRequired();

                entity.Property(e => e.SalesLast30Days)
                    .IsRequired();

                entity.Property(e => e.SalesLast100Days)
                    .IsRequired();

                entity.Property(e => e.LastInboundDate)
                    .IsRequired();

                entity.Property(e => e.LastInventoryDate)
                    .IsRequired();

                entity.Property(e => e.RemainingStockDays)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(e => e.StockConfidence)
                    .IsRequired()
                    .HasConversion<string>();

                entity.HasOne(e => e.Location)
                    .WithMany()
                    .HasForeignKey(e => e.LocationId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<DailySale>(entity =>
            {
                entity.ToTable("DailySales");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.SaleDate)
                    .IsRequired();

                entity.Property(e => e.QuantitySold)
                    .IsRequired();

                entity.HasOne(e => e.Location)
                    .WithMany()
                    .HasForeignKey(e => e.LocationId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<CalendarEvent>(entity =>
            {
                entity.ToTable("CalendarEvents");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .IsRequired();

                entity.Property(e => e.EventType)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(e => e.StartDate)
                    .IsRequired();

                entity.Property(e => e.EndDate)
                    .IsRequired();

                entity.Property(e => e.DemandMultiplier)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(e => e.AffectedLocationType)
                    .IsRequired()
                    .HasConversion<string>();
            });


            // Add seed data or additional configuration as needed
        }
    }
}
