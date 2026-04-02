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
    public class SubLevelRepository : ISubLevelRepository
    {
        private readonly AppDbContext _context;

        public SubLevelRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SubLevel>> GetAllByLevelIdAsync(int levelId)
        {
            return await _context.SubLevels
                .Where(s => s.LevelId == levelId)
                .Include(s => s.ContentItems)
                .OrderBy(s => s.SortOrder)
                .ToListAsync();
        }

        public async Task<SubLevel?> GetByIdAsync(int id)
        {
            return await _context.SubLevels
                .Include(s => s.ContentItems)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<SubLevel> CreateAsync(SubLevel subLevel)
        {
            _context.SubLevels.Add(subLevel);
            await _context.SaveChangesAsync();
            return subLevel;
        }

        public async Task<SubLevel> UpdateAsync(SubLevel subLevel)
        {
            _context.SubLevels.Update(subLevel);
            await _context.SaveChangesAsync();
            return subLevel;
        }

        public async Task DeleteAsync(int id)
        {
            var subLevel = await GetByIdAsync(id);
            if (subLevel != null)
            {
                _context.SubLevels.Remove(subLevel);
                await _context.SaveChangesAsync();
            }
        }
    }
}
