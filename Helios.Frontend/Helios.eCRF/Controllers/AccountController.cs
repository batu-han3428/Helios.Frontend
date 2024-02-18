using Helios.eCRF.Models;
using Helios.eCRF.Services;
using Helios.eCRF.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Helios.Common.DTO;
using Microsoft.AspNetCore.Authorization;

namespace Helios.eCRF.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly IUserService userService;

        public AccountController(IAuthService authService, IUserService userService)
        {
            this.authService = authService;
            this.userService = userService;
        }

        /// <summary>
        /// login işlemi yapar
        /// </summary>
        /// <param name="user">login olmak isteyen kullanıcının bilgilerini</param>
        /// <returns>başarılı başarısız bilgisi döner</returns>
        [HttpPost]
        public async Task<IActionResult> Login(AccountModel user)
        {
            var result = await authService.LoginAsync(user);

            return Ok(result);
        }

        /// <summary>
        /// kullanıcının şifresi sıfırlanır ve yeni şifre mail olarak atılır
        /// </summary>
        /// <param name="userId">kullanıcının id si</param>
        /// <returns>başarılı başarısız döner</returns>
        [HttpGet]
        public async Task<IActionResult> SendNewPasswordForUser(Int64 userId)
        {
            var result = await authService.SendNewPasswordForUser(userId);
            return Ok(result);
        }


        /// <summary>
        /// kullanıcının ad, soyad, maili güncellenir
        /// </summary>
        /// <param name="model">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız döner</returns>
        [HttpPost]
        public async Task<IActionResult> UserProfileResetPassword(UserDTO model)
        {
            //var result = await userService.UpdateUser(model);
            return Ok(/*result*/);
        }

        /// <summary>
        /// iletişim sayfasında kullanıcının girdiği bilgileri mail olarak yetkililere gönderir
        /// </summary>
        /// <param name="contactUsModel">kullanıcının girdiği bilgiler</param>
        /// <returns>başarılı başarısız döner</returns>
        [HttpPost]
        public async Task<IActionResult> ContactUs(ContactUsModel contactUsModel)
        {
            var result = await authService.ContactUsMailAsync(contactUsModel);
            return Ok(result);
        }


        /// <summary>
        /// şifresini unutan kullanıcı için şifre sıfırlama maili gönderilir
        /// </summary>
        /// <param name="email">kullanıcının mail adresi</param>
        /// <returns>başarılı başarısız döner</returns>
        [HttpPost]
        public async Task<IActionResult> SaveForgotPassword(string email, string language)
        {   
            if (string.IsNullOrEmpty(email))
            {
                return NotFound(new ApiResponse<dynamic> { IsSuccess= false, Message = "Mail alanı boş bırakılamaz" });
            }

            var result = await authService.SaveForgotPassword(email, language);

            return Ok(result);
        }


        /// <summary>
        /// kullanıcının şifresini sıfırlamak için tıkladığı linkin geçerli olup olmadığı gibi bilgileri teyit eder
        /// </summary>
        /// <param name="code">şifre sıfırlama maili içinde gönderilen sıfırlama kodu</param>
        /// <param name="username">kullanıcı adı</param>
        /// <param name="firstPassword"></param>
        /// <returns></returns>
        [HttpGet("{code}/{username}")]
        public async Task<IActionResult> ResetPassword(string code = null, string username = null, bool firstPassword = false)
        {
            if (code == null || username == null)
            {
                return Ok(new { isSuccess = false, messsage = "Şifre sıfırlama için kod, kullanıcı adı ve çalışma adı sağlanmalıdır." });
            }

            var result = await authService.ResetPasswordGet(code, username, firstPassword);

            return Ok(result);
        }


        /// <summary>
        /// kullanıcının şifresini günceller
        /// </summary>
        /// <param name="model">kullancıının bilgileri</param>
        /// <returns>başarılı başarısız döner</returns>
        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO model)
        {
            if (!ModelState.IsValid)
            {
                return Ok(model);
            }

            var result = await authService.ResetPasswordPost(model);

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "TenantAdmin")]
        public IActionResult UpdateJwt(JwtDTO jwtDTO)
        {
            var result = authService.UpdateJwt(jwtDTO);
            return Ok(result);
        }
    }
}
