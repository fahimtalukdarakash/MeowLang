using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeowLang.Core.Entities
{
    public class DailyLife
    {
        public int Id { get; set; }

        // How many lives the user has left today — starts at 5, minimum 0
        public int LivesRemaining { get; set; } = 5;

        // Which day this record belongs to — stored as UTC date
        // One record per user per day
        public DateTime Date { get; set; } = DateTime.UtcNow.Date;

        // --- Relationship to User ---
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
