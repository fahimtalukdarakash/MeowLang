using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Interfaces;

namespace MeowLang.Infrastructure.Services
{
    public class TestService : ITestService
    {
        public bool CheckWritingAnswer(string userAnswer, string correctAnswer, string displayType)
        {
            // Always trim extra spaces from both sides
            var trimmedAnswer = userAnswer.Trim();
            var trimmedCorrect = correctAnswer.Trim();

            // For standard display type we need to check what kind of content it is
            // Single words are forgiving — ignore case
            // Sentences are strict — case matters because of German noun capitalization
            if (displayType == "standard")
            {
                // If the correct answer has spaces it is a sentence — strict check
                if (trimmedCorrect.Contains(' '))
                {
                    // Strict — case sensitive, exact match after trimming spaces
                    return trimmedAnswer == trimmedCorrect;
                }
                else
                {
                    // Single word — forgiving, ignore case
                    return trimmedAnswer.Equals(trimmedCorrect, StringComparison.OrdinalIgnoreCase);
                }
            }

            // For alphabet and number types — always forgiving
            // Learning A or 1 does not require perfect casing
            return trimmedAnswer.Equals(trimmedCorrect, StringComparison.OrdinalIgnoreCase);
        }
    }
}
