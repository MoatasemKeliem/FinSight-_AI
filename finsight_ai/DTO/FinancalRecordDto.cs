using System;
using System.ComponentModel.DataAnnotations;
using finsight_ai.Entities.Enum;

namespace finsight_ai.DTO;

public class FinancalRecordDto
{
    [Required]
    public TypeEnum RecordType { get; set; }
    [Required]
    public decimal Amount { get; set; }
    [Required]
    public CategoryEnum Category { get; set; }
    [Required]
    public SourceEnum Source { get; set; }
}
