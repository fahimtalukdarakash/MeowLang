using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Entities;

namespace MeowLang.Core.Interfaces
{
    public interface ILevelRepository
    {
        // Get all levels for a specific language
        Task<IEnumerable<Level>> GetAllByLanguageIdAsync(int languageId);

        // Get one level by its Id
        Task<Level?> GetByIdAsync(int id);

        // Add a new level
        Task<Level> CreateAsync(Level level);

        // Update an existing level
        Task<Level> UpdateAsync(Level level);

        // Delete a level by its Id
        Task DeleteAsync(int id);
    }
}
