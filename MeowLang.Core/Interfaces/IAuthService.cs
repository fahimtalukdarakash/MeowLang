using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Entities;

namespace MeowLang.Core.Interfaces
{
    public interface IAuthService
    {
        // Hashes a plain password — used during registration
        string HashPassword(string password);

        // Checks if a plain password matches a stored hash — used during login
        bool VerifyPassword(string password, string hash);

        // Creates a JWT token for a user — used after successful login
        string GenerateToken(User user);
    }
}
