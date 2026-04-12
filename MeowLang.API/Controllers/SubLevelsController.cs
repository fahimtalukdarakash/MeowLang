using Microsoft.AspNetCore.Mvc;
using MeowLang.Core.Entities;
using MeowLang.Core.Interfaces;
using MeowLang.API.DTOs.Requests;
using MeowLang.API.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;

namespace MeowLang.API.Controllers
{
    [ApiController]
    [Route("api/languages/{languageId}/levels/{levelId}/sublevels")]
    [Authorize(Roles = "admin")]
    public class SubLevelsController : ControllerBase
    {
        private readonly ISubLevelRepository _subLevelRepository;
        private readonly ILevelRepository _levelRepository;
        private readonly ILanguageRepository _languageRepository;


        public SubLevelsController(
            ISubLevelRepository subLevelRepository,
            ILevelRepository levelRepository,
            ILanguageRepository languageRepository)
        {
            _subLevelRepository = subLevelRepository;
            _levelRepository = levelRepository;
            _languageRepository = languageRepository;
        }
        // GET api/languages/1/levels/1/sublevels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubLevelResponse>>> GetAll(int languageId, int levelId)
        {
            // First check if the language exists
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }
            // Second check if level exists
            var level = await _levelRepository.GetByIdAsync(levelId);
            if (level == null)
            {
                return NotFound($"Level with Id {levelId} was not found.");
            }

            var subLevels = await _subLevelRepository.GetAllByLevelIdAsync(levelId);

            var response = subLevels.Select(sl => new SubLevelResponse
            {
                Id = sl.Id,
                Title = sl.Title,
                Description = sl.Description,
                SortOrder = sl.SortOrder,
                DisplayType = sl.DisplayType,
                TotalParts = sl.TotalParts,
                ItemsPerPart = sl.ItemsPerPart,
                LevelId = sl.LevelId,
                ContentItemCount = sl.ContentItems.Count
            });

            return Ok(response);
        }
        // GET api/languages/1/levels/1/sublevels/1
        [HttpGet("{id}")]
        public async Task<ActionResult<SubLevelResponse>> GetById(int languageId, int levelId, int id)
        {
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }

            var level = await _levelRepository.GetByIdAsync(levelId);
            if (level == null)
            {
                return NotFound($"Level with Id {levelId} was not found.");
            }

            var subLevel = await _subLevelRepository.GetByIdAsync(id);
            if (subLevel == null) 
            {
                return NotFound($"Sublevel with Id {id} was not found");
            }

            var response = new SubLevelResponse
            {
                Id = subLevel.Id,
                Title = subLevel.Title,
                Description = subLevel.Description,
                SortOrder = subLevel.SortOrder,
                DisplayType = subLevel.DisplayType,
                TotalParts = subLevel.TotalParts,
                ItemsPerPart = subLevel.ItemsPerPart,
                LevelId = subLevel.LevelId,
                ContentItemCount = subLevel.ContentItems.Count
            };

            return Ok(response);
        }
        // POST api/languages/1/levels
        [HttpPost]
        public async Task<ActionResult<SubLevelResponse>> Create(int languageId, int levelId, CreateSubLevelRequest request)
        {
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }

            var level = await _levelRepository.GetByIdAsync(levelId);
            if (level == null)
            {
                return NotFound($"Level with Id {levelId} was not found.");
            }

            var subLevel = new SubLevel
            {
                Title = request.Title,
                Description = request.Description,
                DisplayType = request.DisplayType,
                SortOrder = request.SortOrder,
                TotalParts= request.TotalParts,
                ItemsPerPart = request.ItemsPerPart,
                LevelId = levelId
            };

            var created = await _subLevelRepository.CreateAsync(subLevel);

            var response = new SubLevelResponse
            {
                Id = created.Id,
                Title = created.Title,
                Description = created.Description,
                SortOrder = created.SortOrder,
                DisplayType = created.DisplayType,
                TotalParts = created.TotalParts,
                ItemsPerPart = created.ItemsPerPart,
                LevelId = created.LevelId,
                ContentItemCount = 0
            };

            return CreatedAtAction(nameof(GetById), new { languageId, levelId, id = created.Id }, response);
        }

        // PUT api/languages/1/levels/1/sublevels/1
        [HttpPut("{id}")]
        public async Task<ActionResult<SubLevelResponse>> Update(
            int languageId, int levelId, int id, UpdateSubLevelRequest request)
        {
            var level = await _levelRepository.GetByIdAsync(levelId);
            if (level == null)
            {
                return NotFound($"Level with Id {levelId} was not found.");
            }

            var subLevel = await _subLevelRepository.GetByIdAsync(id);
            if (subLevel == null)
            {
                return NotFound($"SubLevel with Id {id} was not found.");
            }

            subLevel.Title = request.Title;
            subLevel.Description = request.Description;
            subLevel.SortOrder = request.SortOrder;
            subLevel.TotalParts = request.TotalParts;
            subLevel.ItemsPerPart = request.ItemsPerPart;

            var updated = await _subLevelRepository.UpdateAsync(subLevel);

            var response = new SubLevelResponse
            {
                Id = updated.Id,
                Title = updated.Title,
                Description = updated.Description,
                SortOrder = updated.SortOrder,
                DisplayType = updated.DisplayType,
                TotalParts = updated.TotalParts,
                ItemsPerPart = updated.ItemsPerPart,
                LevelId = updated.LevelId,
                ContentItemCount = updated.ContentItems.Count
            };

            return Ok(response);
        }

        // DELETE api/languages/1/levels/1/sublevels/1
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int languageId, int levelId, int id)
        {
            var language = await _languageRepository.GetByIdAsync(languageId);
            if (language == null)
            {
                return NotFound($"Language with Id {languageId} was not found.");
            }

            var level = await _levelRepository.GetByIdAsync(levelId);
            if (level == null)
            {
                return NotFound($"Level with Id {id} was not found.");
            }
            var subLevel = await _subLevelRepository.GetByIdAsync(id);
            if (subLevel == null)
            {
                return NotFound($"Sublevel with Id {id} was not found");
            }

            await _subLevelRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
