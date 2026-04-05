namespace MeowLang.API.DTOs.Responses
{
    public class TestResultResponse
    {
        // Whether the answer was correct
        public bool IsCorrect { get; set; }

        // Whether the test is fully passed
        public bool IsPassed { get; set; }

        // How many lives remaining after this attempt
        public int LivesRemaining { get; set; }

        // The correct answer — shown to user if they got it wrong
        public string CorrectAnswer { get; set; } = string.Empty;

        // Feedback message shown to the user
        public string Message { get; set; } = string.Empty;

        // Score for speaking tests — null for writing tests
        public double? Score { get; set; }
    }
}
