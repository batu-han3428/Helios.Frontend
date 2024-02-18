using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace Helios.eCRF.Models
{
    public class ResetPasswordViewModel
    {
        [Required]
        public string Username { get; set; }

        [Required(ErrorMessage = "Bu alan zorunludur.")]
        [StringLength(16, ErrorMessage = "Şifre minumum 6 karakter uzunluğunda olmalı", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Şifre veya onay şifresi eşleşmiyor.")]
        public string ConfirmPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string Code { get; set; }
        public bool IsFirstPassword { get; set; }
        public string ReturnMessage { get; set; } = string.Empty;
        public bool Sso { get; set; }

        public bool FirstLogin { get; set; }
        public Int64 FirstResearchId { get; set; }
        public Int64 UserId { get; set; }

    }
}
