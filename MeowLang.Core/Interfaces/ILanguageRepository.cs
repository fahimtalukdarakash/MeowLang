using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Entities;

namespace MeowLang.Core.Interfaces
{
    public interface ILanguageRepository
    {
        // Get all languages
        Task<IEnumerable<Language>> GetAllAsync();

        // Get one language by its Id
        Task<Language?> GetByIdAsync(int id);

        // Add a new language
        Task<Language> CreateAsync(Language language);

        // Update an existing language
        Task<Language> UpdateAsync(Language language);

        // Delete a language by its Id
        Task DeleteAsync(int id);
    }
}
