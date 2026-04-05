using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MeowLang.Core.Interfaces;
using MeowLang.API.DTOs.Responses;
namespace MeowLang.API.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IDailyLifeRepository _dailyLifeRepository;
        private readonly IUserRepository _userRepository;

        public UserController(
            IDailyLifeRepository dailyLifeRepository,
            IUserRepository userRepository)
        {
            _dailyLifeRepository = dailyLifeRepository;
            _userRepository = userRepository;
        }

        // GET api/user/me
        // Returns the logged in user's profile and stats
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileResponse>> GetMyProfile()
        {
            // Read userId from the token — no database call needed for identity
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim);
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Get today's lives
            var dailyLife = await _dailyLifeRepository.GetOrCreateTodayAsync(userId);

            var response = new UserProfileResponse
            {
                UserId = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                IsPremium = user.IsPremium,
                StreakDays = user.StreakDays,
                ProfilePictureUrl = user.ProfilePictureUrl,
                LivesRemaining = dailyLife.LivesRemaining,
                IsOutOfLives = dailyLife.LivesRemaining == 0
            };

            return Ok(response);
        }

        // GET api/user/lives
        // Returns only today's lives — lightweight endpoint
        [HttpGet("lives")]
        public async Task<ActionResult<DailyLifeResponse>> GetMyLives()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim);
            var dailyLife = await _dailyLifeRepository.GetOrCreateTodayAsync(userId);

            var response = new DailyLifeResponse
            {
                Id = dailyLife.Id,
                LivesRemaining = dailyLife.LivesRemaining,
                Date = dailyLife.Date,
                UserId = dailyLife.UserId
            };

            return Ok(response);
        }
    }
}
