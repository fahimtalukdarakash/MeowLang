using Microsoft.AspNetCore.Mvc;

namespace MeowLang.API.Controllers
{
    public class LevelsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
