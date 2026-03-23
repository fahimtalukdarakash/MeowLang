using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeowLang.Core.Entities
{
    public class Level
    {
        public int Id { get; set; }
        // "beginner", "a1", "a2", "b1", "b2", "c1"
        public required string Code { get; set; }
        // "Beginner", "A1", "A2" — shown to the user
        public required string DisplayName { get; set; }
        // Controls the order they appear: Beginner=0, A1=1, A2=2 ...
        public int SortOrder { get; set; }
        // --- Relationship to Language ---

        // This is the FOREIGN KEY — the actual number stored in the database column
        public int LanguageId { get; set; }
        // This is the NAVIGATION PROPERTY — EF Core uses this to load the full Language object
        public Language Language { get; set; } = null!;
        // One Level has many SubLevels
        public ICollection<SubLevel> SubLevels { get; set; } = new List<SubLevel>();

    }
}
