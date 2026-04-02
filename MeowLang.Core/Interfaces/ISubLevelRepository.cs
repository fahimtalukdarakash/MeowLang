using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Entities;

namespace MeowLang.Core.Interfaces
{
    public interface ISubLevelRepository
    {
        // Get all sublevels for a specific level
        Task<IEnumerable<SubLevel>> GetAllByLevelIdAsync(int levelId);

        // Get one sublevel by its Id
        Task<SubLevel?> GetByIdAsync(int id);

        // Add a new sublevel
        Task<SubLevel> CreateAsync(SubLevel subLevel);

        // Update an existing sublevel
        Task<SubLevel> UpdateAsync(SubLevel subLevel);

        // Delete a sublevel by its Id
        Task DeleteAsync(int id);
    }
}
