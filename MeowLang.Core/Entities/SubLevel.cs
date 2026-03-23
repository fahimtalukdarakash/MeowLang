using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeowLang.Core.Entities
{
    public class SubLevel
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int SortOrder { get; set; }
        // "alphabet", "number", "standard"
        public required string DisplayType { get; set; }
        // You control this from the CMS
        public int TotalParts { get; set; } = 1;
        // How many items per part — null means show all at once
        public int? ItemsPerPart { get; set; }
        // --- Relationship to Level ---
        public int LevelId { get; set; }
        public Level Level { get; set; } = null!;
        // --- Relationship to ContentItems ---
        public ICollection<ContentItem> ContentItems { get; set; } = new List<ContentItem>();
    }
}
