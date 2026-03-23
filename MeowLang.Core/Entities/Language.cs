using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeowLang.Core.Entities
{
    public class Language
    {
        // WHY 'Id': Every entity needs a primary key. EF Core auto-recognizes "Id".
        public int Id { get; set; }
        // WHY 'required': Tells C# this cannot be null. No language without a code.
        public required string Code { get; set; }
        public required string Name { get; set; }
        public string? FlagUrl { get; set; }
        // WHY 'bool': A language can exist in DB but be turned off. No deletion needed.
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // WHY this collection: EF Core uses this to understand the relationship.
        // "One Language has many Levels" — this is a Navigation Property.
        public ICollection<Level> Levels { get; set; } = new List<Level>();

    }
}
