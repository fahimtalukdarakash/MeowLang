namespace MeowLang.API.DTOs.Responses
{
    public class ContentItemResponse
    {
        public int Id { get; set; }
        public string TargetText { get; set; } = string.Empty;
        public string NativeText { get; set; } = string.Empty;
        public string? ExampleWordsJson { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int PartNumber { get; set; }
        public int SortOrder { get; set; }
        public int SubLevelId { get; set; }
    }
}
