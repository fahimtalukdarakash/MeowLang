namespace MeowLang.API.DTOs.Requests
{
    public class CreateLanguageRequest
    {
        // "de" for German, "fr" for French
        public required string Code { get; set; }

        // "German", "French"
        public required string Name { get; set; }

        // Optional — can be added later
        public string? FlagUrl { get; set; }
    }
}
