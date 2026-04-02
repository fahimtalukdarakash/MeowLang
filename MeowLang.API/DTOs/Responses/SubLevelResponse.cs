namespace MeowLang.API.DTOs.Responses
{
    public class SubLevelResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SortOrder { get; set; }
        public string DisplayType { get; set; } = string.Empty;
        public int TotalParts { get; set; }
        public int? ItemsPerPart { get; set; }
        public int LevelId { get; set; }

        // Calculated — not a database column
        public int ContentItemCount { get; set; }
    }
}
