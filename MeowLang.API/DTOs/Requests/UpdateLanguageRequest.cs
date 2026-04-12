namespace MeowLang.API.DTOs.Requests
{
    public class UpdateLanguageRequest
    {
        // Code is excluded — once set it never changes
        public required string Name { get; set; }
        public string? FlagUrl { get; set; }

        // Admin can activate or deactivate a language
        public bool IsActive { get; set; }
    }
}
