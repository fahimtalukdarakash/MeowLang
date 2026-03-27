// File: MeowLang.Infrastructure/Data/AppDbContext.cs

using Microsoft.EntityFrameworkCore;
using MeowLang.Core.Entities;

namespace MeowLang.Infrastructure.Data;

public class AppDbContext : DbContext
{
    // This constructor is required by EF Core
    // It receives the database configuration from Program.cs
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // --- DbSets --- 
    // Each DbSet represents one table in your database
    // The name you give here becomes the table name
    public DbSet<Language> Languages { get; set; }
    public DbSet<Level> Levels { get; set; }
    public DbSet<SubLevel> SubLevels { get; set; }
    public DbSet<ContentItem> ContentItems { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<DailyLife> DailyLives { get; set; }
    public DbSet<TestCompletion> TestCompletions { get; set; }
}