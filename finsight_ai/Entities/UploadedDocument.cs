using System;
using System.ComponentModel.DataAnnotations;

namespace finsight_ai.Entities;

public class UploadedDocument
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public string FileName { get; set; } = string.Empty;

    public string FileExtension { get; set; } = string.Empty;

    [Required]
    public string ExtractedText { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public Guid CompanyProfileId { get; set; }
    [System.ComponentModel.DataAnnotations.Schema.ForeignKey("CompanyProfileId")]
    public CompanyProfile? CompanyProfile { get; set; }
}
