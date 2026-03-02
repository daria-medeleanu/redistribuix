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
                entity.Property(e => e.Profile).IsRequired();
                entity.Property(e => e.PurchasingPower).IsRequired();
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
                    .IsRequired();
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
                    .IsRequired();

                entity.Property(e => e.ReleaseDate)
                    .IsRequired();
            });

                       
            // Add seed data or additional configuration as needed
        }
    }
}
