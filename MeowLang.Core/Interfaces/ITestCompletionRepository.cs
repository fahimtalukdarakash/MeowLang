using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Entities;

namespace MeowLang.Core.Interfaces
{
    public interface ITestCompletionRepository
    {
        // Check if a specific test was already passed
        Task<bool> HasPassedTestAsync(int userId, int subLevelId, int partNumber, int testNumber);

        // Save a test completion record
        Task<TestCompletion> CreateAsync(TestCompletion testCompletion);

        // Get all completions for a user in a sublevel
        Task<IEnumerable<TestCompletion>> GetByUserAndSubLevelAsync(int userId, int subLevelId);
    }
}
