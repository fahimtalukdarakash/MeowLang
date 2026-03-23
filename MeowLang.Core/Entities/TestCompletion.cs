using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeowLang.Core.Entities
{
    public class TestCompletion
    {
        public int Id { get; set; }

        // Which part this test belongs to — example: part 2 of Common Words
        public int PartNumber { get; set; }

        // Which test number — 1 for writing, 2 for speaking
        public int TestNumber { get; set; }

        // Whether the user passed or failed
        public bool IsPassed { get; set; }

        // How many times the user attempted this test
        public int AttemptsCount { get; set; } = 1;

        // The score they got — useful for speaking test where AI gives a percentage
        public double? Score { get; set; }

        // When they completed this test
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

        // --- Relationship to User ---
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // --- Relationship to SubLevel ---
        // We need to know which SubLevel this test belongs to
        public int SubLevelId { get; set; }
        public SubLevel SubLevel { get; set; } = null!;
    }
}
