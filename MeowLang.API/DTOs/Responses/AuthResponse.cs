namespace MeowLang.API.DTOs.Responses
{
    public class AuthResponse
    {
        // The JWT token the frontend will store and send with every request
        public string Token { get; set; } = string.Empty;

        // Basic user info so the frontend can display it without another API call
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

        // When the token expires — frontend uses this to know when to log out
        public DateTime ExpiresAt { get; set; }
    }
}
