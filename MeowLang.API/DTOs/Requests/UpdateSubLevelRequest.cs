namespace MeowLang.API.DTOs.Requests
{
    public class UpdateSubLevelRequest
    {
        public required string Title { get; set; }
        public string? Description { get; set; }

        // DisplayType excluded — changing this after content is uploaded
        // would break how the frontend displays existing content
        public int SortOrder { get; set; }
        public int TotalParts { get; set; }
        public int? ItemsPerPart { get; set; }
    }
}
