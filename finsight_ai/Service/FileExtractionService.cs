using System;
using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class FileExtractionService
{
    private readonly ApplicationDbContext _context;

    public FileExtractionService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<string> ExtractText(IFormFile file, string userId)
    {
        var user = await _context.CompanyProfiles.FirstOrDefaultAsync(u => u.UserId == userId)
         ?? throw new UnauthorizedAccessException("Not Authorized");

        var extension = Path.GetExtension(file.FileName).ToLower();
        using var stream = file.OpenReadStream();

        return extension switch
        {
            ".pdf" => ExtractPdfText(stream),
            ".docx" => ExtractWordText(stream),
            ".xlsx" => ExtractExcelText(stream),
            ".csv" => await ExtractCsvText(stream),
            _ => throw new NotSupportedException("File not supported")
        };
    }

    private string ExtractPdfText(Stream stream)
    {
        using var reader = new iText.Kernel.Pdf.PdfReader(stream);
        using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(reader);
        var text = new StringBuilder();
        for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
        {
            text.Append(iText.Kernel.Pdf.Canvas.Parser.PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i)));
        }
        return text.ToString();
    }

    private string ExtractWordText(Stream stream)
    {
        using var wordDoc = DocumentFormat.OpenXml.Packaging.WordprocessingDocument.Open(stream, false);

        return wordDoc!.MainDocumentPart!.Document!.Body!.InnerText;
    }

    private string ExtractExcelText(Stream stream)
    {
        using var workbook = new ClosedXML.Excel.XLWorkbook(stream);
        var text = new StringBuilder();
        foreach (var sheet in workbook.Worksheets)
        {
            foreach (var row in sheet.RowsUsed())
            {
                text.AppendLine(string.Join(" ", row.Cells().Select(c => c.Value.ToString())));
            }
        }
        return text.ToString();
    }

    private async Task<string> ExtractCsvText(Stream stream)
    {
        using var reader = new StreamReader(stream);
        return await reader.ReadToEndAsync();
    }
}