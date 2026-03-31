namespace MeowLang.API.DTOs.Responses
{
    public class LanguageResponse
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? FlagUrl { get; set; }
        public bool IsActive { get; set; }
    }
}
