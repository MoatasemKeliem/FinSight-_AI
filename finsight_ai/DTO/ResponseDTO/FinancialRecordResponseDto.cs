using System;
using finsight_ai.Entities.Enum;

namespace finsight_ai.DTO.ResponseDTO;

public class FinancialRecordResponseDto
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public CategoryEnum Category { get; set; }
}
