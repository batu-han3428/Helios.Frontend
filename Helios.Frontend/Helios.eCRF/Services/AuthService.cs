using Helios.Common.DTO;
using Helios.eCRF.Models;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using MassTransit;
using RestSharp;

namespace Helios.eCRF.Services
{
    public class AuthService : ApiBaseService, IAuthService
    {
        public AuthService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        public async Task<ApiResponse<dynamic>> LoginAsync(AccountModel model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/Login", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<bool> SendNewPasswordForUser(Int64 userId)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/SendNewPasswordForUser", Method.Get);
                req.AddParameter("userId", userId);
                var result = await client.ExecuteAsync(req);
            }

            return false;
        }

        public async Task<bool> UserProfileResetPassword(UserDTO model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/UserProfileResetPassword", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync(req);
            }

            return false;
        }

        public async Task<ApiResponse<dynamic>> ContactUsMailAsync(ContactUsModel contactUsModel)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/ContactUsMail", Method.Post);
                req.AddJsonBody(contactUsModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SaveForgotPassword(string Mail, string Language)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest($"AuthAccount/SaveForgotPassword?Mail={Mail}&Language={Language}", Method.Post);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> ResetPasswordGet(string code, string username, bool firstPassword)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/ResetPasswordGet", Method.Get);
                req.AddParameter("code", code);
                req.AddParameter("username", username);
                req.AddParameter("firstPassword", firstPassword);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> ResetPasswordPost(ResetPasswordDTO model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/ResetPasswordPost", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public ApiResponse<dynamic> UpdateJwt(JwtDTO jwtDTO)
        {
            jwtDTO.Token = Token;
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/UpdateJwt", Method.Post);
                req.AddJsonBody(jwtDTO);
                var result = client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Result.Data;
            }
        }
    }
}
