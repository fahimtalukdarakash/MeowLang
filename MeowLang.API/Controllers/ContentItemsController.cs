using Microsoft.AspNetCore.Mvc;
using MeowLang.Core.Entities;
using MeowLang.Core.Interfaces;
using MeowLang.API.DTOs.Requests;
using MeowLang.API.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;

namespace MeowLang.API.Controllers
{
    [ApiController]
    [Route("api/languages/{languageId}/levels/{levelId}/sublevels/{subLevelId}/contentitems")]
    [Authorize(Roles = "admin")]
    public class ContentItemsController : ControllerBase
    {
        private readonly IContentItemRepository _contentItemRepository;
        private readonly ISubLevelRepository _subLevelRepository;

        public ContentItemsController(
            IContentItemRepository contentItemRepository,
            ISubLevelRepository subLevelRepository)
        {
            _contentItemRepository = contentItemRepository;
            _subLevelRepository = subLevelRepository;
        }

        // GET api/languages/1/levels/1/sublevels/1/contentitems
        // GET api/languages/1/levels/1/sublevels/1/contentitems?partNumber=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContentItemResponse>>> GetAll(
            int languageId, int levelId, int subLevelId,
            [FromQuery] int? partNumber)
        {
            var subLevel = await _subLevelRepository.GetByIdAsync(subLevelId);
            if (subLevel == null)
            {
                return NotFound($"SubLevel with Id {subLevelId} was not found.");
            }

            var contentItems = await _contentItemRepository
                .GetAllBySubLevelIdAsync(subLevelId, partNumber);

            var response = contentItems.Select(c => new ContentItemResponse
            {
                Id = c.Id,
                TargetText = c.TargetText,
                NativeText = c.NativeText,
                ExampleWordsJson = c.ExampleWordsJson,
                AudioUrl = c.AudioUrl,
                ImageUrl = c.ImageUrl,
                PartNumber = c.PartNumber,
                SortOrder = c.SortOrder,
                SubLevelId = c.SubLevelId
            });

            return Ok(response);
        }

        // GET api/languages/1/levels/1/sublevels/1/contentitems/1
        [HttpGet("{id}")]
        public async Task<ActionResult<ContentItemResponse>> GetById(
            int languageId, int levelId, int subLevelId, int id)
        {
            var subLevel = await _subLevelRepository.GetByIdAsync(subLevelId);
            if (subLevel == null)
            {
                return NotFound($"SubLevel with Id {subLevelId} was not found.");
            }

            var contentItem = await _contentItemRepository.GetByIdAsync(id);
            if (contentItem == null)
            {
                return NotFound($"ContentItem with Id {id} was not found.");
            }

            var response = new ContentItemResponse
            {
                Id = contentItem.Id,
                TargetText = contentItem.TargetText,
                NativeText = contentItem.NativeText,
                ExampleWordsJson = contentItem.ExampleWordsJson,
                AudioUrl = contentItem.AudioUrl,
                ImageUrl = contentItem.ImageUrl,
                PartNumber = contentItem.PartNumber,
                SortOrder = contentItem.SortOrder,
                SubLevelId = contentItem.SubLevelId
            };

            return Ok(response);
        }

        // POST api/languages/1/levels/1/sublevels/1/contentitems
        [HttpPost]
        public async Task<ActionResult<ContentItemResponse>> Create(
            int languageId, int levelId, int subLevelId,
            CreateContentItemRequest request)
        {
            var subLevel = await _subLevelRepository.GetByIdAsync(subLevelId);
            if (subLevel == null)
            {
                return NotFound($"SubLevel with Id {subLevelId} was not found.");
            }

            var contentItem = new ContentItem
            {
                TargetText = request.TargetText,
                NativeText = request.NativeText,
                ExampleWordsJson = request.ExampleWordsJson,
                PartNumber = request.PartNumber,
                SortOrder = request.SortOrder,
                SubLevelId = subLevelId,
                // These are null for now — filled later by Azure TTS and image service
                AudioUrl = null,
                ImageUrl = null
            };

            var created = await _contentItemRepository.CreateAsync(contentItem);

            var response = new ContentItemResponse
            {
                Id = created.Id,
                TargetText = created.TargetText,
                NativeText = created.NativeText,
                ExampleWordsJson = created.ExampleWordsJson,
                AudioUrl = created.AudioUrl,
                ImageUrl = created.ImageUrl,
                PartNumber = created.PartNumber,
                SortOrder = created.SortOrder,
                SubLevelId = created.SubLevelId
            };

            return CreatedAtAction(nameof(GetById),
                new { languageId, levelId, subLevelId, id = created.Id },
                response);
        }

        // DELETE api/languages/1/levels/1/sublevels/1/contentitems/1
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(
            int languageId, int levelId, int subLevelId, int id)
        {
            var subLevel = await _subLevelRepository.GetByIdAsync(subLevelId);
            if (subLevel == null)
            {
                return NotFound($"SubLevel with Id {subLevelId} was not found.");
            }

            var contentItem = await _contentItemRepository.GetByIdAsync(id);
            if (contentItem == null)
            {
                return NotFound($"ContentItem with Id {id} was not found.");
            }

            await _contentItemRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
