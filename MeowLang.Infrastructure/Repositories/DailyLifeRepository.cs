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
    public class DailyLifeRepository : IDailyLifeRepository
    {
        private readonly AppDbContext _context;

        public DailyLifeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DailyLife> GetOrCreateTodayAsync(int userId)
        {
            var today = DateTime.UtcNow.Date;

            // Try to find today's record for this user
            var dailyLife = await _context.DailyLives
                .FirstOrDefaultAsync(d => d.UserId == userId && d.Date == today);

            // If no record exists for today, create a fresh one with 5 lives
            if (dailyLife == null)
            {
                dailyLife = new DailyLife
                {
                    UserId = userId,
                    Date = today,
                    LivesRemaining = 5
                };

                _context.DailyLives.Add(dailyLife);
                await _context.SaveChangesAsync();
            }

            return dailyLife;
        }

        public async Task<DailyLife> DeductLifeAsync(int userId)
        {
            // Get or create today's record first
            var dailyLife = await GetOrCreateTodayAsync(userId);

            // Only deduct if lives are remaining — never go below 0
            if (dailyLife.LivesRemaining > 0)
            {
                dailyLife.LivesRemaining--;
                await _context.SaveChangesAsync();
            }

            return dailyLife;
        }
    }
}
