using Microsoft.AspNetCore.Mvc;
using MeowLang.Core.Entities;
using MeowLang.Core.Interfaces;
using MeowLang.API.DTOs.Requests;
using MeowLang.API.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;

namespace MeowLang.API.Controllers
{
    [ApiController]
    [Route("api/languages/{languageId}/levels")]
    [Authorize(Roles = "admin")]
    public class LevelsController : ControllerBase
    {
        private readonly ILevelRepository _levelRepository;
        private readonly ILanguageRepository _languageRepository;

        public LevelsController(
            ILevelRepository levelRepository,
            ILanguageRepository languageRepository)
        {
            _levelRepository = levelRepository;
            _languageRepository = languageRepository;
        }

        // GET api/languages/1/levels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LevelResponse>>> GetAll(int languageId)
        {
            // First check if the language exists
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }

            var levels = await _levelRepository.GetAllByLanguageIdAsync(languageId);

            var response = levels.Select(l => new LevelResponse
            {
                Id = l.Id,
                Code = l.Code,
                DisplayName = l.DisplayName,
                SortOrder = l.SortOrder,
                LanguageId = l.LanguageId,
                SubLevelCount = l.SubLevels.Count
            });

            return Ok(response);
        }

        // GET api/languages/1/levels/1
        [HttpGet("{id}")]
        public async Task<ActionResult<LevelResponse>> GetById(int languageId, int id)
        {
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }

            var level = await _levelRepository.GetByIdAsync(id);
            if (level == null)
            {
                return NotFound($"Level with Id {id} was not found.");
            }

            var response = new LevelResponse
            {
                Id = level.Id,
                Code = level.Code,
                DisplayName = level.DisplayName,
                SortOrder = level.SortOrder,
                LanguageId = level.LanguageId,
                SubLevelCount = level.SubLevels.Count
            };

            return Ok(response);
        }

        // POST api/languages/1/levels
        [HttpPost]
        public async Task<ActionResult<LevelResponse>> Create(int languageId, CreateLevelRequest request)
        {
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }

            var level = new Level
            {
                Code = request.Code,
                DisplayName = request.DisplayName,
                SortOrder = request.SortOrder,
                LanguageId = languageId
            };

            var created = await _levelRepository.CreateAsync(level);

            var response = new LevelResponse
            {
                Id = created.Id,
                Code = created.Code,
                DisplayName = created.DisplayName,
                SortOrder = created.SortOrder,
                LanguageId = created.LanguageId,
                SubLevelCount = 0
            };

            return CreatedAtAction(nameof(GetById), new { languageId, id = created.Id }, response);
        }

        // PUT api/languages/1/levels/1
        [HttpPut("{id}")]
        public async Task<ActionResult<LevelResponse>> Update(
            int languageId, int id, UpdateLevelRequest request)
        {
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }

            var level = await _levelRepository.GetByIdAsync(id);
            if (level == null)
            {
                return NotFound($"Level with Id {id} was not found.");
            }

            level.DisplayName = request.DisplayName;
            level.SortOrder = request.SortOrder;

            var updated = await _levelRepository.UpdateAsync(level);

            var response = new LevelResponse
            {
                Id = updated.Id,
                Code = updated.Code,
                DisplayName = updated.DisplayName,
                SortOrder = updated.SortOrder,
                LanguageId = updated.LanguageId,
                SubLevelCount = updated.SubLevels.Count
            };

            return Ok(response);
        }

        // DELETE api/languages/1/levels/1
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int languageId, int id)
        {
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }

            var level = await _levelRepository.GetByIdAsync(id);
            if (level == null)
            {
                return NotFound($"Level with Id {id} was not found.");
            }

            await _levelRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
