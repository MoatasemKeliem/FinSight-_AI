using System;
using finsight_ai.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace finsight_ai;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    public DbSet<CompanyProfile> CompanyProfiles { get; set; }
    public DbSet<BusinessDecision> BusinessDecisions { get; set; }
    public DbSet<CashFlowSnapshot> CashFlowSnapshots { get; set; }
    public DbSet<AIAnalysis> AIAnalyses { get; set; }
    public DbSet<FinancialRecord> FinancialRecords { get; set; }
    public DbSet<RiskAnalysis> RiskAnalyses { get; set; }
    public DbSet<PredictionAnalysis> PredictionAnalysis { get; set; }
    public DbSet<RecommendationAnalysis> RecommendationAnalysis { get; set; }
    public DbSet<ScenarioAnalysis> ScenarioAnalyses { get; set; }
    public DbSet<UploadedDocument> UploadedDocuments { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // CompanyProfile -> FinancialRecords
        builder.Entity<CompanyProfile>()
            .HasMany(c => c.FinancialRecords)
            .WithOne(f => f.CompanyProfile)
            .HasForeignKey(f => f.CompanyProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // CompanyProfile -> CashFlowSnapshots
        builder.Entity<CompanyProfile>()
            .HasMany(c => c.CashFlowSnapshots)
            .WithOne(cfs => cfs.CompanyProfile)
            .HasForeignKey(cfs => cfs.CompanyProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // CompanyProfile -> BusinessDecisions
        builder.Entity<CompanyProfile>()
            .HasMany(c => c.BusinessDecisions)
            .WithOne(bd => bd.CompanyProfile)
            .HasForeignKey(bd => bd.CompanyProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // CompanyProfile -> AIAnalysis
        builder.Entity<CompanyProfile>()
            .HasMany(c => c.AIAnalyses)
            .WithOne(ai => ai.CompanyProfile)
            .HasForeignKey(ai => ai.CompanyProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // Decimal precision for financial fields
        builder.Entity<CompanyProfile>()
            .Property(c => c.MonthlyRevenue)
            .HasColumnType("decimal(18,2)");

        builder.Entity<CompanyProfile>()
            .Property(c => c.MonthlyCosts)
            .HasColumnType("decimal(18,2)");

        builder.Entity<FinancialRecord>()
            .Property(f => f.Amount)
            .HasColumnType("decimal(18,2)");

        builder.Entity<CashFlowSnapshot>()
            .Property(cfs => cfs.TotalRevenue)
            .HasColumnType("decimal(18,2)");

        builder.Entity<CashFlowSnapshot>()
            .Property(cfs => cfs.TotalExpenses)
            .HasColumnType("decimal(18,2)");

        builder.Entity<CashFlowSnapshot>()
            .Property(cfs => cfs.NetCashFlow)
            .HasColumnType("decimal(18,2)");

        builder.Entity<BusinessDecision>()
            .Property(bd => bd.EstimatedCost)
            .HasColumnType("decimal(18,2)");

        builder.Entity<BusinessDecision>()
            .Property(bd => bd.ExpectedReturn)
            .HasColumnType("decimal(18,2)");

        builder.Entity<CompanyProfile>()
            .HasMany(c => c.RiskAnalysis)
            .WithOne(ra => ra.CompanyProfile)
            .HasForeignKey(ra => ra.CompanyProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CompanyProfile>()
        .HasMany(c => c.PredictionAnalyses)
        .WithOne(pa => pa.CompanyProfile)
        .HasForeignKey(pa => pa.CompanyProfileId)
        .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CompanyProfile>()
    .HasMany(c => c.RecommendationAnalyses)
    .WithOne(pa => pa.CompanyProfile)
    .HasForeignKey(pa => pa.CompanyProfileId)
    .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CompanyProfile>()
        .HasMany(c => c.ScenarioAnalyses)
        .WithOne(sa => sa.CompanyProfile)
        .HasForeignKey(sa => sa.CompanyProfileId)
        .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CompanyProfile>()
            .HasMany(c => c.UploadedDocuments)
            .WithOne(ud => ud.CompanyProfile)
            .HasForeignKey(ud => ud.CompanyProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
