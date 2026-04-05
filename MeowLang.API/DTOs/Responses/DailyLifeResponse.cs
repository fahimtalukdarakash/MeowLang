namespace MeowLang.API.DTOs.Responses
{
    public class DailyLifeResponse
    {
        public int Id { get; set; }
        public int LivesRemaining { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }

        // Tells the frontend whether the user is out of lives
        public bool IsOutOfLives => LivesRemaining == 0;
    }
}
