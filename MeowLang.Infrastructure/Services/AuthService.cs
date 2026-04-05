using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MeowLang.Core.Entities;
using MeowLang.Core.Interfaces;

namespace MeowLang.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string HashPassword(string password)
        {
            // BCrypt automatically generates a random salt and includes it in the hash
            // WorkFactor 11 means it takes ~300ms to hash — slow enough to stop brute force attacks
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);
        }

        public bool VerifyPassword(string password, string hash)
        {
            // BCrypt extracts the salt from the stored hash and uses it to hash the input
            // Then compares — returns true if they match
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        public string GenerateToken(User user)
        {
            // Read the secret key from appsettings.json
            var secretKey = _configuration["Jwt:SecretKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));

            // The signing credentials — uses HMAC SHA256 algorithm
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Claims are the pieces of information stored inside the token
            // The frontend and server can read these without a database call
            var claims = new[]
            {
            new Claim("userId", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("userName", user.UserName),
            new Claim(ClaimTypes.Role, user.Role)
        };

            // Build the token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Token valid for 7 days
                signingCredentials: credentials
            );

            // Serialize the token to a string — this is what gets sent to the frontend
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
