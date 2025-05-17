using Helios.eCRF.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Net.Mail;
using Helios.Common.DTO;

namespace Helios.eCRF.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<dynamic>> LoginAsync(AccountModel model);
        Task<bool> SendNewPasswordForUser(Int64 userId);
        Task<bool> UserProfileResetPassword(UserDTO model);
        Task<ApiResponse<dynamic>> ContactUsMailAsync(ContactUsModel contactUsDTO);
        Task<ApiResponse<dynamic>> SaveForgotPassword(string Mail, string Language);
        Task<ApiResponse<dynamic>> ResetPasswordGet(string code, string username, bool firstPassword);
        Task<ApiResponse<dynamic>> ResetPasswordPost(ResetPasswordDTO model);
        ApiResponse<dynamic> UpdateJwt(JwtDTO jwtDTO);
    }
}
