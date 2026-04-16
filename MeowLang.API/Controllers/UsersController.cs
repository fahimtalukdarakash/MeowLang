using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MeowLang.Core.Interfaces;

namespace MeowLang.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize(Roles = "admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // GET api/users
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var users = await _userRepository.GetAllAsync();

            var response = users.Select(u => new
            {
                Id = u.Id,
                UserName = u.UserName,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role,
                IsPremium = u.IsPremium,
                StreakDays = u.StreakDays,
                CreatedAt = u.CreatedAt,
                LastLoginAt = u.LastLoginAt
            });

            return Ok(response);
        }
    }
}
