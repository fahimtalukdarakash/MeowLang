// File: MeowLang.API/Controllers/StatsController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MeowLang.Infrastructure.Data;
using MeowLang.API.DTOs.Responses;

namespace MeowLang.API.Controllers;

[ApiController]
[Route("api/stats")]
[Authorize(Roles = "admin")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StatsController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/stats
    [HttpGet]
    public async Task<ActionResult<StatsResponse>> GetStats()
    {
        // Run all counts at the same time for efficiency
        var totalLanguages = await _context.Languages.CountAsync();
        var activeLanguages = await _context.Languages.CountAsync(l => l.IsActive);
        var totalLevels = await _context.Levels.CountAsync();
        var totalSubLevels = await _context.SubLevels.CountAsync();
        var totalContentItems = await _context.ContentItems.CountAsync();
        var totalUsers = await _context.Users.CountAsync();

        var response = new StatsResponse
        {
            TotalLanguages = totalLanguages,
            ActiveLanguages = activeLanguages,
            TotalLevels = totalLevels,
            TotalSubLevels = totalSubLevels,
            TotalContentItems = totalContentItems,
            TotalUsers = totalUsers
        };

        return Ok(response);
    }
}