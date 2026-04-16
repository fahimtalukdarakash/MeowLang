namespace MeowLang.API.DTOs.Responses
{
    public class StatsResponse
    {
        public int TotalLanguages { get; set; }
        public int TotalLevels { get; set; }
        public int TotalSubLevels { get; set; }
        public int TotalContentItems { get; set; }
        public int TotalUsers { get; set; }
        public int ActiveLanguages { get; set; }
    }
}
