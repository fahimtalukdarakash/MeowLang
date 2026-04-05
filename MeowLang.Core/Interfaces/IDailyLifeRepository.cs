using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Entities;

namespace MeowLang.Core.Interfaces
{
    public interface IDailyLifeRepository
    {
        // Get today's lives for a user — creates a new record if none exists
        Task<DailyLife> GetOrCreateTodayAsync(int userId);

        // Deduct one life from today's record
        Task<DailyLife> DeductLifeAsync(int userId);
    }
}
