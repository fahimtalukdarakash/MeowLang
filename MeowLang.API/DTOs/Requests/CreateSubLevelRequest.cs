namespace MeowLang.API.DTOs.Requests
{
    public class CreateSubLevelRequest
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string DisplayType { get; set; }
        public int SortOrder { get; set; }
        public int TotalParts { get; set; } = 1;
        public int? ItemsPerPart { get; set; }
    }
}
