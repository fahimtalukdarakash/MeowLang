namespace MeowLang.API.DTOs.Requests
{
    public class CreateLevelRequest
    {
        public required string Code { get; set; }
        public required string DisplayName { get; set; }
        public int SortOrder { get; set; }
    }
}
