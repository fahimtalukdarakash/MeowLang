namespace MeowLang.API.DTOs.Requests
{
    public class UpdateContentItemRequest
    {
        public required string TargetText { get; set; }
        public required string NativeText { get; set; }
        public string? ExampleWordsJson { get; set; }
        public int PartNumber { get; set; }
        public int SortOrder { get; set; }

        // AudioUrl and ImageUrl excluded from manual update
        // These are managed automatically by the system
    }
}
