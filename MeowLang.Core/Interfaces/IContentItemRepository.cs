using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Entities;

namespace MeowLang.Core.Interfaces
{
    public interface IContentItemRepository
    {
        // Get all items for a sublevel — optionally filtered by part number
        Task<IEnumerable<ContentItem>> GetAllBySubLevelIdAsync(int subLevelId, int? partNumber);

        // Get one item by its Id
        Task<ContentItem?> GetByIdAsync(int id);

        // Add a new content item
        Task<ContentItem> CreateAsync(ContentItem contentItem);

        // Update an existing content item
        Task<ContentItem> UpdateAsync(ContentItem contentItem);

        // Delete a content item by its Id
        Task DeleteAsync(int id);
    }
}
