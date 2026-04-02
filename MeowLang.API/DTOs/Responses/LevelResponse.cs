namespace MeowLang.API.DTOs.Responses
{
    public class LevelResponse
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public int LanguageId { get; set; }

        // Calculated — not a database column
        public int SubLevelCount { get; set; }
    }
}
