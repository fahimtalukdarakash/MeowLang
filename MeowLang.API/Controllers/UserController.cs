using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MeowLang.Core.Interfaces;
using MeowLang.API.DTOs.Responses;
using MeowLang.API.DTOs.Requests;
using MeowLang.Core.Entities;

namespace MeowLang.API.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IDailyLifeRepository _dailyLifeRepository;
        private readonly IUserRepository _userRepository;
        private readonly ISubLevelRepository _subLevelRepository;

        public UserController(
            IDailyLifeRepository dailyLifeRepository,
            IUserRepository userRepository,
            ISubLevelRepository subLevelRepository)
        {
            _dailyLifeRepository = dailyLifeRepository;
            _userRepository = userRepository;
            _subLevelRepository = subLevelRepository;
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
        // POST api/user/submit-test
        [HttpPost("submit-test")]
        public async Task<ActionResult<TestResultResponse>> SubmitTest(
            SubmitTestRequest request,
            [FromServices] ITestService testService,
            [FromServices] IContentItemRepository contentItemRepository,
            [FromServices] ITestCompletionRepository testCompletionRepository)
        {
            // Get userId from token
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim);

            // Step 1 — Check if user has lives remaining
            var dailyLife = await _dailyLifeRepository.GetOrCreateTodayAsync(userId);
            if (dailyLife.LivesRemaining == 0)
            {
                return Ok(new TestResultResponse
                {
                    IsCorrect = false,
                    IsPassed = false,
                    LivesRemaining = 0,
                    Message = "You have no lives remaining. Come back tomorrow!",
                    CorrectAnswer = string.Empty
                });
            }

            // Step 2 — Get the content item being tested
            var contentItem = await contentItemRepository.GetByIdAsync(request.ContentItemId);
            if (contentItem == null)
            {
                return NotFound("Content item not found.");
            }

            // Step 3 — Get the sublevel to know the display type
            var subLevel = await _subLevelRepository.GetByIdAsync(request.SubLevelId);
            if (subLevel == null)
            {
                return NotFound("SubLevel not found.");
            }

            // Step 4 — Check the answer
            var isCorrect = testService.CheckWritingAnswer(
                request.UserAnswer,
                contentItem.TargetText,
                subLevel.DisplayType);

            if (isCorrect)
            {
                // Check if this test was already passed — avoid duplicate records
                var alreadyPassed = await testCompletionRepository.HasPassedTestAsync(
                    userId, request.SubLevelId, request.PartNumber, request.TestNumber);

                if (!alreadyPassed)
                {
                    // Save the test completion
                    var completion = new TestCompletion
                    {
                        UserId = userId,
                        SubLevelId = request.SubLevelId,
                        PartNumber = request.PartNumber,
                        TestNumber = request.TestNumber,
                        IsPassed = true,
                        AttemptsCount = 1,
                        Score = 100,
                        CompletedAt = DateTime.UtcNow
                    };

                    await testCompletionRepository.CreateAsync(completion);
                }

                return Ok(new TestResultResponse
                {
                    IsCorrect = true,
                    IsPassed = true,
                    LivesRemaining = dailyLife.LivesRemaining,
                    Message = "Correct! Well done!",
                    CorrectAnswer = contentItem.TargetText
                });
            }
            else
            {
                // Wrong answer — deduct a life
                var updatedLife = await _dailyLifeRepository.DeductLifeAsync(userId);

                return Ok(new TestResultResponse
                {
                    IsCorrect = false,
                    IsPassed = false,
                    LivesRemaining = updatedLife.LivesRemaining,
                    Message = updatedLife.LivesRemaining == 0
                        ? "Wrong! You have no lives left. Come back tomorrow!"
                        : $"Wrong! You have {updatedLife.LivesRemaining} lives remaining.",
                    CorrectAnswer = contentItem.TargetText
                });
            }
        }
    }
}
