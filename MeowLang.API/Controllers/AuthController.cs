using Microsoft.AspNetCore.Mvc;
using MeowLang.Core.Entities;
using MeowLang.Core.Interfaces;
using MeowLang.API.DTOs.Requests;
using MeowLang.API.DTOs.Responses;

namespace MeowLang.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;

        public AuthController(
            IUserRepository userRepository,
            IAuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }

        // POST api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            // Check if email already exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return BadRequest("A user with this email already exists.");
            }

            // Build the user entity
            var user = new User
            {
                UserName = request.UserName,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = _authService.HashPassword(request.Password),
                Role = "user"
            };

            var created = await _userRepository.CreateAsync(user);

            // Generate token immediately after registration
            // User is logged in right after registering
            var token = _authService.GenerateToken(created);

            var response = new AuthResponse
            {
                Token = token,
                UserId = created.Id,
                UserName = created.UserName,
                Email = created.Email,
                Role = created.Role,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            return Ok(response);
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                // We say "invalid credentials" instead of "email not found"
                // This way hackers cannot tell which emails are registered
                return Unauthorized("Invalid credentials.");
            }

            // Verify password
            var isPasswordValid = _authService.VerifyPassword(request.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Update last login time
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Generate token
            var token = _authService.GenerateToken(user);

            var response = new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            return Ok(response);
        }
    }
}
