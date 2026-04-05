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
    public class TestCompletionRepository : ITestCompletionRepository
    {
        private readonly AppDbContext _context;

        public TestCompletionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasPassedTestAsync(
            int userId, int subLevelId, int partNumber, int testNumber)
        {
            return await _context.TestCompletions
                .AnyAsync(t =>
                    t.UserId == userId &&
                    t.SubLevelId == subLevelId &&
                    t.PartNumber == partNumber &&
                    t.TestNumber == testNumber &&
                    t.IsPassed == true);
        }

        public async Task<TestCompletion> CreateAsync(TestCompletion testCompletion)
        {
            _context.TestCompletions.Add(testCompletion);
            await _context.SaveChangesAsync();
            return testCompletion;
        }

        public async Task<IEnumerable<TestCompletion>> GetByUserAndSubLevelAsync(
            int userId, int subLevelId)
        {
            return await _context.TestCompletions
                .Where(t => t.UserId == userId && t.SubLevelId == subLevelId)
                .OrderBy(t => t.PartNumber)
                .ThenBy(t => t.TestNumber)
                .ToListAsync();
        }
    }
}
