using Microsoft.AspNetCore.Mvc;
using MeowLang.Core.Entities;
using MeowLang.Core.Interfaces;
using MeowLang.API.DTOs.Requests;
using MeowLang.API.DTOs.Responses;

namespace MeowLang.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LanguagesController : ControllerBase
    {
        private readonly ILanguageRepository _languageRepository;

        public LanguagesController(ILanguageRepository languageRepository)
        {
            _languageRepository = languageRepository;
        }

        // GET api/languages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LanguageResponse>>> GetAll()
        {
            var languages = await _languageRepository.GetAllAsync();

            var response = languages.Select(l => new LanguageResponse
            {
                Id = l.Id,
                Code = l.Code,
                Name = l.Name,
                FlagUrl = l.FlagUrl,
                IsActive = l.IsActive
            });

            return Ok(response);
        }

        // GET api/languages/1
        [HttpGet("{id}")]
        public async Task<ActionResult<LanguageResponse>> GetById(int id)
        {
            var language = await _languageRepository.GetByIdAsync(id);

            if (language == null)
            {
                return NotFound($"Language with Id {id} was not found.");
            }

            var response = new LanguageResponse
            {
                Id = language.Id,
                Code = language.Code,
                Name = language.Name,
                FlagUrl = language.FlagUrl,
                IsActive = language.IsActive
            };

            return Ok(response);
        }

        // POST api/languages
        [HttpPost]
        public async Task<ActionResult<LanguageResponse>> Create(CreateLanguageRequest request)
        {
            var language = new Language
            {
                Code = request.Code,
                Name = request.Name,
                FlagUrl = request.FlagUrl
            };

            var created = await _languageRepository.CreateAsync(language);

            var response = new LanguageResponse
            {
                Id = created.Id,
                Code = created.Code,
                Name = created.Name,
                FlagUrl = created.FlagUrl,
                IsActive = created.IsActive
            };

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, response);
        }

        // DELETE api/languages/1
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var language = await _languageRepository.GetByIdAsync(id);

            if (language == null)
            {
                return NotFound($"Language with Id {id} was not found.");
            }

            await _languageRepository.DeleteAsync(id);

            return NoContent();
        }
    }
}
