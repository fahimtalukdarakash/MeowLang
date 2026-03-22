using Microsoft.AspNetCore.Mvc;

namespace MeowLang.API.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
