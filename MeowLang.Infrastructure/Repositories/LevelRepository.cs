using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MeowLang.Core.Entities;
using MeowLang.Core.Interfaces;
using MeowLang.Infrastructure.Data;

namespace MeowLang.Infrastructure.Repositories
{
    public class LevelRepository : ILevelRepository
    {
        private readonly AppDbContext _context;

        public LevelRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Level>> GetAllByLanguageIdAsync(int languageId)
        {
            return await _context.Levels
                .Where(l => l.LanguageId == languageId)
                .Include(l => l.SubLevels)
                .OrderBy(l => l.SortOrder)
                .ToListAsync();
        }

        public async Task<Level?> GetByIdAsync(int id)
        {
            return await _context.Levels
                .Include(l => l.SubLevels)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Level> CreateAsync(Level level)
        {
            _context.Levels.Add(level);
            await _context.SaveChangesAsync();
            return level;
        }

        public async Task<Level> UpdateAsync(Level level)
        {
            _context.Levels.Update(level);
            await _context.SaveChangesAsync();
            return level;
        }

        public async Task DeleteAsync(int id)
        {
            var level = await GetByIdAsync(id);
            if (level != null)
            {
                _context.Levels.Remove(level);
                await _context.SaveChangesAsync();
            }
        }
    }
}
