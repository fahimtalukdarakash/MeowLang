using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeowLang.Core.Entities
{
    public class ContentItem
    {
        public int Id { get; set; }

        // The word/letter/number in the target language
        public required string TargetText { get; set; }

        // The English meaning
        public required string NativeText { get; set; }

        // Only for alphabet type — example words stored as JSON
        public string? ExampleWordsJson { get; set; }

        // Future: Azure TTS will fill this automatically
        public string? AudioUrl { get; set; }

        // Future: illustration image when budget allows
        public string? ImageUrl { get; set; }

        // Which part this item belongs to
        public int PartNumber { get; set; } = 1;

        // Order inside its part
        public int SortOrder { get; set; }

        // --- Relationship to SubLevel ---
        public int SubLevelId { get; set; }
        public SubLevel SubLevel { get; set; } = null!;
    }
}
