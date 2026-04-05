namespace MeowLang.API.DTOs.Requests
{
    public class RegisterRequest
    {
        public required string UserName { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }

        // Optional — only if user wants two factor authentication later
        public string? PhoneNumber { get; set; }
    }
}
