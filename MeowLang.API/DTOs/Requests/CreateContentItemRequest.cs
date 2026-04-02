namespace MeowLang.API.DTOs.Requests
{
    public class CreateContentItemRequest
    {
        public required string TargetText { get; set; }
        public required string NativeText { get; set; }

        // Only for alphabet display type
        public string? ExampleWordsJson { get; set; }

        // Which part this item belongs to
        public int PartNumber { get; set; } = 1;

        // Order inside its part
        public int SortOrder { get; set; }
    }
}
