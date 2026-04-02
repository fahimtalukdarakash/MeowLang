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
    public class ContentItemRepository : IContentItemRepository
    {
        private readonly AppDbContext _context;

        public ContentItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ContentItem>> GetAllBySubLevelIdAsync(int subLevelId, int? partNumber)
        {
            var query = _context.ContentItems
                .Where(c => c.SubLevelId == subLevelId);

            // If partNumber is provided, filter by it
            if (partNumber.HasValue)
            {
                query = query.Where(c => c.PartNumber == partNumber.Value);
            }

            return await query
                .OrderBy(c => c.PartNumber)
                .ThenBy(c => c.SortOrder)
                .ToListAsync();
        }

        public async Task<ContentItem?> GetByIdAsync(int id)
        {
            return await _context.ContentItems
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<ContentItem> CreateAsync(ContentItem contentItem)
        {
            _context.ContentItems.Add(contentItem);
            await _context.SaveChangesAsync();
            return contentItem;
        }

        public async Task<ContentItem> UpdateAsync(ContentItem contentItem)
        {
            _context.ContentItems.Update(contentItem);
            await _context.SaveChangesAsync();
            return contentItem;
        }

        public async Task DeleteAsync(int id)
        {
            var contentItem = await GetByIdAsync(id);
            if (contentItem != null)
            {
                _context.ContentItems.Remove(contentItem);
                await _context.SaveChangesAsync();
            }
        }
    }
}
