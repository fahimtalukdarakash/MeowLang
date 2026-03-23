using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeowLang.Core.Entities
{
    public class User
    {
        public int Id { get; set; }

        public required string UserName { get; set; }

        // First and last name separately — useful for formal greetings
        public required string FirstName { get; set; }

        public required string LastName { get; set; }
        public required string Email { get; set; }

        // Optional — only needed when user enables two factor authentication
        public string? PhoneNumber { get; set; }
        // Never store plain password — always store the hashed version
        // Example: "password123" becomes "$2a$11$xyz..." after hashing
        public required string PasswordHash { get; set; }
        // "user" for regular users, "admin" for CMS access
        public required string Role { get; set; } = "user";
        // false = free plan, true = paid plan
        public bool IsPremium { get; set; } = false;
        // How many consecutive days the user has studied
        // Resets to 0 if they miss a day
        public int StreakDays { get; set; } = 0;

        // Profile picture — nullable, user may not upload one
        public string? ProfilePictureUrl { get; set; }
        // When the user registered
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Last time the user logged in — useful for detecting inactive users
        public DateTime? LastLoginAt { get; set; }
        // One User has many DailyLives records (one per day)
        public ICollection<DailyLife> DailyLives { get; set; } = new List<DailyLife>();

        // One User has many TestCompletions records
        public ICollection<TestCompletion> TestCompletions { get; set; } = new List<TestCompletion>();
    }
}
