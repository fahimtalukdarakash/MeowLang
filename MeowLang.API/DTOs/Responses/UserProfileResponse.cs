namespace MeowLang.API.DTOs.Responses
{
    public class UserProfileResponse
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsPremium { get; set; }
        public int StreakDays { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public int LivesRemaining { get; set; }
        public bool IsOutOfLives { get; set; }
    }
}
