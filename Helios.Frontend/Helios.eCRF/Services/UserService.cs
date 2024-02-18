using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;
using Helios.eCRF.Models;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using System.Net;

namespace Helios.eCRF.Services
{
    public class UserService : ApiBaseService, IUserService
    {
        public UserService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        public async Task<UserDTO> GetUserByEmail(string mail)
        {
            var user = new UserDTO();

            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/GetUserByEmail", Method.Get);
                req.AddParameter("mail", mail);
                var result = await client.ExecuteAsync(req);
                user = JsonConvert.DeserializeObject<UserDTO>(result.Content);
            }

            return user;
        }

        public async Task<dynamic> AddUser(UserDTO model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/AddUser", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<dynamic>(req);
                return result.Data;
            }
        }

        public async Task<bool> PassiveOrActiveUser(UserDTO model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/PassiveOrActiveUser", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync(req);
            }

            return false;
        }

        public async Task<ApiResponse<dynamic>> UpdateUser(AspNetUserDTO model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/UpdateUser", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<bool> AddRole(UserDTO model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/AddRole", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync(req);
            }

            return false;
        }

        #region Tenants
        public async Task<RestResponse<List<TenantModel>>> GetAuthTenantList()
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/GetTenantList", Method.Get);
                var result = await client.ExecuteAsync<List<TenantModel>>(req);
                return result;
            }
        }

        private async Task<RestResponse<List<TenantModel>>> GetTenantsStudyCount(List<Int64> tenantIds)
        {
            using (var client = CoreServiceClient)
            {
                string tenantIdsString = string.Join(",", tenantIds);
                var req = new RestRequest("CoreUser/GetTenantsStudyCount", Method.Get);
                req.AddParameter("tenantIds", tenantIdsString);
                var result = await client.ExecuteAsync<List<TenantModel>>(req);
                return result;
            }
        }

        public async Task<RestResponse<List<TenantModel>>> GetTenantList()
        {
            RestRequest restRequest = new RestRequest();

            var authTenants = await GetAuthTenantList();

            if (!authTenants.IsSuccessful && authTenants.Data == null)
            {
                return new RestResponse<List<TenantModel>>(restRequest)
                {
                    Data = null,
                    StatusCode = HttpStatusCode.InternalServerError
                };
            }

            if (authTenants.Data.Count > 0)
            {
                var counts = await GetTenantsStudyCount(authTenants.Data.Select(x => x.Id).ToList());

                if (!counts.IsSuccessful && counts.Data == null)
                {
                    return new RestResponse<List<TenantModel>>(restRequest)
                    {
                        Data = null,
                        StatusCode = HttpStatusCode.InternalServerError
                    };
                }

                if (counts.Data.Count > 0)
                {
                    try
                    {
                        var data = (from aTenants in authTenants.Data
                                    join count in counts.Data on aTenants.Id equals count.Id into countGroup
                                    from count in countGroup.DefaultIfEmpty()
                                    select new TenantModel
                                    {
                                        Id = aTenants.Id,
                                        Name = aTenants.Name,
                                        ActiveStudies = (count != null) ? count.ActiveStudies + " / " + aTenants.StudyLimit : "0 / " + (aTenants.StudyLimit != null ? aTenants.StudyLimit : "0"),
                                        CreatedAt = aTenants.CreatedAt,
                                        UpdatedAt = aTenants.UpdatedAt
                                    }).ToList();

                        return new RestResponse<List<TenantModel>>(restRequest)
                        {
                            Data = data,
                            StatusCode = HttpStatusCode.OK
                        };
                    }
                    catch (Exception)
                    {
                        return new RestResponse<List<TenantModel>>(restRequest)
                        {
                            Data = null,
                            StatusCode = HttpStatusCode.InternalServerError
                        };
                    }
                }
            }

            return authTenants;
        }

        public async Task<RestResponse<TenantModel>> GetTenant(Int64 tenantId)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/GetTenant", Method.Get);
                req.AddParameter("tenantId", tenantId);
                var result = await client.ExecuteAsync<TenantModel>(req);
                return result;
            }
        }

        private async Task<int> GetStudyCount(Int64? tenantId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetStudyCount", Method.Get);
                req.AddParameter("tenantId", tenantId.ToString());
                var result = await client.ExecuteAsync<int>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetTenant(TenantDTO tenantDTO)
        {
            if (tenantDTO.Id.HasValue && tenantDTO.Id != 0)
            {
                int studyCount = await GetStudyCount(tenantDTO.Id);

                if (!string.IsNullOrEmpty(tenantDTO.StudyLimit) && int.TryParse(tenantDTO.StudyLimit, out int studyLimitValue))
                {
                    if (studyCount > studyLimitValue)
                    {
                        return new ApiResponse<dynamic>
                        {
                            IsSuccess = false,
                            Message = "@Change studies have been added to the tenant. For this reason, you cannot enter a smaller number.",
                            Values = new { Change = studyCount }
                        };
                    }
                }
            }

            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/SetTenant", Method.Post);
                req.AddParameter("Id", tenantDTO.Id?.ToString());
                req.AddParameter("UserId", tenantDTO.UserId);
                req.AddParameter("TenantName", tenantDTO.TenantName);
                req.AddParameter("TimeZone", tenantDTO.TimeZone);
                req.AddParameter("StudyLimit", tenantDTO.StudyLimit);
                req.AddParameter("UserLimit", tenantDTO.UserLimit);
                if (tenantDTO.TenantLogo != null && tenantDTO.TenantLogo.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        tenantDTO.TenantLogo.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        req.AddFile("TenantLogo", fileBytes, tenantDTO.TenantLogo.FileName, tenantDTO.TenantLogo.ContentType);
                    }
                }
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Permissions
        public async Task<RestResponse<List<UserPermissionDTO>>> GetPermissionRoleList(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetPermissionRoleList", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<UserPermissionDTO>>(req);
                return result;
            }
        }

        public async Task<RestResponse<List<UserPermissionDTO>>> GetRoleList(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetRoleList", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<UserPermissionDTO>>(req);
                return result;
            }
        }

        private async Task<RestResponse<UserPermissionRoleDTO>> GetUserIdsRole(Int64 roleId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetUserIdsRole", Method.Get);
                req.AddParameter("roleId", roleId);
                var result = await client.ExecuteAsync<UserPermissionRoleDTO>(req);
                return result;
            }
        }
        
        public async Task<RestResponse<List<UserPermissionRoleModel>>> GetRoleUsers(Int64 roleId)
        {
            RestRequest restRequest = new RestRequest();

            var userIdsRole = await GetUserIdsRole(roleId);

            if (!userIdsRole.IsSuccessful && userIdsRole.Data == null)
            {
                return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                {
                    Data = null,
                    StatusCode = HttpStatusCode.InternalServerError
                };
            }

            if (userIdsRole.Data.UserIds.Count > 0)
            {
                var result = await GetUserList(userIdsRole.Data.UserIds);

                if (result.IsSuccessful && result.Data != null && result.Data.Count > 0)
                {
                    try
                    {
                        var data = result.Data.Select(x => new UserPermissionRoleModel
                        {
                            Role = userIdsRole.Data.Role,
                            Name = x.Name + " " + x.LastName
                        }).ToList();

                        return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                        {
                            Data = data,
                            StatusCode = HttpStatusCode.OK
                        };
                    }
                    catch (Exception)
                    {
                        return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                        {
                            Data = null,
                            StatusCode = HttpStatusCode.InternalServerError
                        };
                    }
                }
                else
                {
                    return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                    {
                        Data = null,
                        StatusCode = HttpStatusCode.InternalServerError
                    };
                }
            }
            else
            {
                return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                {
                    Data = new List<UserPermissionRoleModel>(),
                    StatusCode = HttpStatusCode.OK
                };
            }
        }

        private async Task<RestResponse<List<StudyUsersRolesDTO>>> GetStudyUserIdsRole(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetStudyUserIdsRole", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<StudyUsersRolesDTO>>(req);
                return result;
            }
        }

        public async Task<RestResponse<List<UserPermissionRoleModel>>> GetStudyRoleUsers(Int64 studyId)
        {
            RestRequest restRequest = new RestRequest();

            var userIdsRole = await GetStudyUserIdsRole(studyId);

            if (!userIdsRole.IsSuccessful && userIdsRole.Data == null)
            {
                return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                {
                    Data = null,
                    StatusCode = HttpStatusCode.InternalServerError
                };
            }

            if (userIdsRole.Data.Count > 0)
            {
                var result = await GetUserList(userIdsRole.Data.Select(x=>x.Id).ToList());

                if (result.IsSuccessful && result.Data != null && result.Data.Count > 0) {
                    try
                    {
                        var data = result.Data.Join(userIdsRole.Data, aspNetUser => aspNetUser.Id, studyUser => studyUser.Id, (aspNetUser, studyUser) =>
                                    new UserPermissionRoleModel
                                    {
                                        Role = studyUser.RoleName,
                                        Name = aspNetUser.Name + " " + aspNetUser.LastName
                                    }).ToList();

                        return new RestResponse<List<UserPermissionRoleModel>>(restRequest){
                            Data = data,
                            StatusCode = HttpStatusCode.OK
                        };
                    }
                    catch (Exception)
                    {
                        return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                        {
                            Data = null,
                            StatusCode = HttpStatusCode.InternalServerError
                        };
                    }
                }
                else
                {
                    return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                    {
                        Data = null,
                        StatusCode = HttpStatusCode.InternalServerError
                    };
                }
            }
            else
            {
                return new RestResponse<List<UserPermissionRoleModel>>(restRequest)
                {
                    Data = new List<UserPermissionRoleModel>(),
                    StatusCode = HttpStatusCode.OK
                };
            }
        }

        public async Task<ApiResponse<dynamic>> SetPermission(SetPermissionModel setPermissionModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/SetPermission", Method.Post);
                req.AddJsonBody(setPermissionModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> AddOrUpdatePermissionRol(UserPermissionModel userPermission)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/AddOrUpdatePermissionRol", Method.Post);
                req.AddJsonBody(userPermission);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteRole(UserPermissionModel userPermission)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/DeleteRole", Method.Post);
                req.AddJsonBody(userPermission);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Study user

        private async Task<RestResponse<List<StudyUserDTO>>> GetStudyUsers(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetStudyUsers", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<StudyUserDTO>>(req);
                return result;
            }
        }

        private async Task<RestResponse<List<AspNetUserDTO>>> GetUserList(List<Int64> AuthUserIds)
        {
            using (var client = AuthServiceClient)
            {
                string authUserIdsString = string.Join(",", AuthUserIds);
                var req = new RestRequest("AdminUser/GetUserList", Method.Get);
                req.AddParameter("AuthUserIds", authUserIdsString);
                var users = await client.ExecuteAsync<List<AspNetUserDTO>>(req);
                return users;
            }
        }

        private async Task<AspNetUserDTO> GetUser(string email)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/GetUser", Method.Get);
                req.AddParameter("email", email);
                var result = await client.ExecuteAsync<AspNetUserDTO>(req);
                return result.Data;
            }
        }

        private async Task<bool> GetCheckStudyUser(Int64 authUserId, Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetCheckStudyUser", Method.Get);
                req.AddParameter("authUserId", authUserId);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<bool>(req);
                return result.Data;
            }
        }

        private async Task<ApiResponse<StudyUserDTO>> AddStudyUser(StudyUserModel model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/AddStudyUser", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<StudyUserDTO>>(req);
                return result.Data;
            }
        }

        private async Task<ApiResponse<dynamic>> SetStudyUserCore(StudyUserModel studyUserModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/SetStudyUser", Method.Post);
                req.AddJsonBody(studyUserModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        private async Task AddStudyUserMail(StudyUserModel model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/AddStudyUserMail", Method.Post);
                req.AddJsonBody(model);
                await client.ExecuteAsync(req);
            }
        }

        public async Task<RestResponse<List<StudyUserDTO>>> GetStudyUserList(Int64 studyId)
        {
            RestRequest restRequest = new RestRequest();

            var studyUsers = await GetStudyUsers(studyId);

            if (!studyUsers.IsSuccessful && studyUsers.Data == null)
            {
                return new RestResponse<List<StudyUserDTO>>(restRequest)
                {
                    Data = null,
                    StatusCode = HttpStatusCode.InternalServerError
                };
            }

            if (studyUsers.Data.Count > 0)
            {
                var aspNetUserDTOs = await GetUserList(studyUsers.Data.Select(x => x.AuthUserId).ToList());

                if (aspNetUserDTOs.IsSuccessful && aspNetUserDTOs.Data != null && aspNetUserDTOs.Data.Count > 0)
                {
                    try
                    {
                        var data = aspNetUserDTOs.Data.Join(studyUsers.Data, aspNetUser => aspNetUser.Id, studyUser => studyUser.AuthUserId, (aspNetUser, studyUser) =>
                                    new StudyUserDTO
                                    {
                                        StudyUserId = studyUser.StudyUserId,
                                        AuthUserId = aspNetUser.Id,
                                        Name = aspNetUser.Name,
                                        LastName = aspNetUser.LastName,
                                        IsActive = studyUser.IsActive,
                                        Email = aspNetUser.Email,
                                        RoleName = studyUser.RoleName,
                                        RoleId = studyUser.RoleId,
                                        Sites = studyUser.Sites,
                                        ResponsiblePerson = studyUser.ResponsiblePerson,
                                        CreatedOn = studyUser.CreatedOn,
                                        LastUpdatedOn = studyUser.LastUpdatedOn
                                    }).ToList();
                        return new RestResponse<List<StudyUserDTO>>(restRequest)
                        {
                            Data = data,
                            StatusCode = HttpStatusCode.OK
                        };
                    }
                    catch (Exception)
                    {
                        return new RestResponse<List<StudyUserDTO>>(restRequest)
                        {
                            Data = null,
                            StatusCode = HttpStatusCode.InternalServerError
                        };
                    }
                }
                else
                {
                    return new RestResponse<List<StudyUserDTO>>(restRequest)
                    {
                        Data = null,
                        StatusCode = HttpStatusCode.InternalServerError
                    };
                }
            }
            else
            {
                return studyUsers;
            }
        }

        public async Task<ApiResponse<StudyUserDTO>> GetStudyUser(string email, Int64 studyId)
        {
            var user = await GetUser(email);

            if (user != null)
            {
                if (GetCheckStudyUser(user.Id, studyId).Result)
                {
                    return new ApiResponse<StudyUserDTO>
                    {
                        IsSuccess = false,
                        Message = "This user is already registered in the system."
                    };
                }
                else
                {
                    return new ApiResponse<StudyUserDTO>
                    {
                        IsSuccess = true,
                        Message = "",
                        Values = new StudyUserDTO
                        {
                            AuthUserId = user.Id,
                            Name = user.Name,
                            LastName = user.LastName,
                            Email = user.Email
                        }
                    };
                }
            }
            else
            {
                return new ApiResponse<StudyUserDTO>
                {
                    IsSuccess = true,
                    Message = "",
                    Values = new StudyUserDTO()
                };
            }
        }

        public async Task<ApiResponse<dynamic>> SetStudyUser(StudyUserModel studyUserModel)
        {
            if (studyUserModel.AuthUserId == 0)
            {
                var result = await AddStudyUser(studyUserModel);

                if (result.IsSuccess)
                {
                    studyUserModel.AuthUserId = result.Values.AuthUserId;
                    studyUserModel.Password = result.Values.Password;
                    studyUserModel.FirstAddition = true;
                }
                else
                {
                    return new ApiResponse<dynamic>
                    {
                        IsSuccess = false,
                        Message = "An unexpected error occurred.",
                    };
                }
            }

            var response = await SetStudyUserCore(studyUserModel);

            if (response.IsSuccess && studyUserModel.StudyUserId == 0)
            {
                await AddStudyUserMail(studyUserModel);
            }

            return response;
        }

        public async Task<ApiResponse<dynamic>> ActivePassiveStudyUser(StudyUserModel studyUserModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/ActivePassiveStudyUser", Method.Post);
                req.AddJsonBody(studyUserModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> ActivePassiveStudyUsers(StudyUserModel studyUserModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/ActivePassiveStudyUsers", Method.Post);
                req.AddJsonBody(studyUserModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        private async Task<ApiResponse<DeleteStudyUserDTO>> DeleteCoreStudyUser(StudyUserModel studyUserModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/DeleteStudyUser", Method.Post);
                req.AddJsonBody(studyUserModel);
                var result = await client.ExecuteAsync<ApiResponse<DeleteStudyUserDTO>>(req);
                return result.Data;
            }
        }

        private async Task<ApiResponse<DeleteStudyUserDTO>> DeleteAuthStudyUser(StudyUserModel studyUserModel)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/DeleteStudyUser", Method.Post);
                req.AddJsonBody(studyUserModel);
                var result = await client.ExecuteAsync<ApiResponse<DeleteStudyUserDTO>>(req);
                return result.Data;
            }
        }
        
        public async Task<ApiResponse<DeleteStudyUserDTO>> DeleteStudyUser(StudyUserModel studyUserModel)
        {
            var result = await DeleteCoreStudyUser(studyUserModel);

            if (result.IsSuccess && result.Values.AuthDelete)
            {
                return await DeleteAuthStudyUser(studyUserModel);
            }

            return result;
        }

        public async Task<ApiResponse<dynamic>> UserResetPassword(StudyUserModel model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/UserResetPassword", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Tenant user

        private async Task<RestResponse<List<TenantUserDTO>>> GetTenantUsers(Int64 tenantId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetTenantUsers", Method.Get);
                req.AddParameter("tenantId", tenantId);
                var result = await client.ExecuteAsync<List<TenantUserDTO>>(req);
                return result;
            }
        }

        public async Task<RestResponse<List<TenantUserDTO>>> GetTenantUserList(Int64 tenantId)
        {
            RestRequest restRequest = new RestRequest();

            var tenantUsers = await GetTenantUsers(tenantId);

            if (!tenantUsers.IsSuccessful && tenantUsers.Data == null)
            {
                return new RestResponse<List<TenantUserDTO>>(restRequest)
                {
                    Data = null,
                    StatusCode = HttpStatusCode.InternalServerError
                };
            }

            if (tenantUsers.Data.Count > 0)
            {
                var aspNetUserDTOs = await GetUserList(tenantUsers.Data.Select(x => x.AuthUserId).ToList());

                if (aspNetUserDTOs.IsSuccessful && aspNetUserDTOs.Data != null && aspNetUserDTOs.Data.Count > 0)
                {
                    try
                    {
                        var data = aspNetUserDTOs.Data.Join(tenantUsers.Data, aspNetUser => aspNetUser.Id, tenantUser => tenantUser.AuthUserId, (aspNetUser, tenantUser) =>
                                                            new TenantUserDTO
                                                            {
                                                                StudyUserId = tenantUser.StudyUserId,
                                                                AuthUserId = aspNetUser.Id,
                                                                StudyId = tenantUser.StudyId,
                                                                Name = aspNetUser.Name,
                                                                LastName = aspNetUser.LastName,
                                                                IsActive = tenantUser.IsActive,
                                                                Email = aspNetUser.Email,
                                                                StudyName = tenantUser.StudyName,
                                                                StudyDemoLive = tenantUser.StudyDemoLive,
                                                                CreatedOn = tenantUser.CreatedOn,
                                                                LastUpdatedOn = tenantUser.LastUpdatedOn
                                                            }).ToList();

                        return new RestResponse<List<TenantUserDTO>>(restRequest) { 
                            Data = data,
                            StatusCode = HttpStatusCode.OK
                        };
                    }
                    catch (Exception e)
                    {
                        return new RestResponse<List<TenantUserDTO>>(restRequest)
                        {
                            Data = null,
                            StatusCode = HttpStatusCode.InternalServerError
                        };
                    }
                }
                else
                {
                    return new RestResponse<List<TenantUserDTO>>(restRequest)
                    {
                        Data = null,
                        StatusCode = HttpStatusCode.InternalServerError
                    };
                }
            }
            else
            {
                return tenantUsers;
            }
        }

        public async Task<ApiResponse<dynamic>> SetTenantUser(TenantUserModel tenantUserModel)
        {
            return await UpdateUser(new AspNetUserDTO
            {
                Id = tenantUserModel.AuthUserId,
                Email = tenantUserModel.Email,
                Name = tenantUserModel.Name,
                LastName = tenantUserModel.LastName
            });
        }
 
        #endregion

        #region System Admin User

        public async Task<ApiResponse<SystemAdminDTO>> SetSystemAdminUser(SystemAdminDTO systemAdminDTO)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/SetSystemAdminUser", Method.Post);
                req.AddJsonBody(systemAdminDTO);
                var result = await client.ExecuteAsync<ApiResponse<SystemAdminDTO>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<List<SystemUserModel>>> GetSystemAdminUserList()
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/GetSystemAdminUserList", Method.Get);
                var result = await client.ExecuteAsync<List<SystemUserModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SystemAdminActivePassive(SystemAdminDTO systemAdminDTO)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/SystemAdminActivePassive", Method.Post);
                req.AddJsonBody(systemAdminDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SystemAdminResetPassword(SystemAdminDTO systemAdminDTO)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/SystemAdminResetPassword", Method.Post);
                req.AddJsonBody(systemAdminDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SystemAdminDelete(SystemAdminDTO systemAdminDTO)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/SystemAdminDelete", Method.Post);
                req.AddJsonBody(systemAdminDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Tenant Admin User
        private async Task<ApiResponse<dynamic>> SetTenantAdminUser(SystemAdminDTO systemAdminDTO)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/SetTenantAdminUser", Method.Post);
                req.AddJsonBody(systemAdminDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Tenant And System Admin User
        public async Task<ApiResponse<dynamic>> SetAspNetUser(AspNetUserDTO model)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/SetAspNetUser", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetSystemAdminAndTenantAdminUser(SystemAdminDTO systemAdminDTO)
        {
            ApiResponse<dynamic> result = null;

            if (!systemAdminDTO.isAdd.Value)
            {
                var result1 = await SetAspNetUser(new AspNetUserDTO { Id = systemAdminDTO.Id, Email = systemAdminDTO.Email, Name = systemAdminDTO.Name, LastName = systemAdminDTO.LastName, PhoneNumber = systemAdminDTO.PhoneNumber });

                if (!result1.IsSuccess)
                {
                    return result1;
                }

                var result2 = await SetSystemAdminUser(systemAdminDTO);

                result = new ApiResponse<dynamic>
                {
                    IsSuccess = result2.IsSuccess,
                    Message = result2.Message
                };

                if (!result2.IsSuccess)
                {
                    return result;
                }

                result = await SetTenantAdminUser(systemAdminDTO);
            }
            else
            {
                if (systemAdminDTO.RoleIds.Contains((int)Roles.SystemAdmin))
                {
                    var result1 = await SetSystemAdminUser(systemAdminDTO);

                    result = new ApiResponse<dynamic>
                    {
                        IsSuccess = result1.IsSuccess,
                        Message = result1.Message
                    };

                    if (!result1.IsSuccess)
                    {
                        return result;
                    }
                    else
                    {
                        systemAdminDTO.Password = result1.Values.Password;
                    }
                }

                if (systemAdminDTO.RoleIds.Contains((int)Roles.TenantAdmin))
                {
                    result = await SetTenantAdminUser(systemAdminDTO);
                }
            }

            return result;
        }

        private async Task<ApiResponse<dynamic>> TenantAdminDelete(TenantAndSystemAdminDTO tenantAndSystemAdminDTO)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/TenantAdminDelete", Method.Post);
                req.AddJsonBody(tenantAndSystemAdminDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> TenantAndSystemAdminDelete(TenantAndSystemAdminDTO tenantAndSystemAdminDTO)
        {
            ApiResponse<dynamic> result = null;

            if (tenantAndSystemAdminDTO.RoleIds.Contains((Int64)Roles.SystemAdmin))
            {
                var result1 = await SystemAdminDelete(new SystemAdminDTO { Id = tenantAndSystemAdminDTO.Id, UserId = tenantAndSystemAdminDTO.UserId });

                result = new ApiResponse<dynamic>
                {
                    IsSuccess = result1.IsSuccess,
                    Message = result1.Message
                };

                if (!result1.IsSuccess)
                {
                    return result;
                }
            }

            if (tenantAndSystemAdminDTO.RoleIds.Contains((Int64)Roles.TenantAdmin))
            {
                result = await TenantAdminDelete(tenantAndSystemAdminDTO);
            }

            return result;
        }

        private async Task<ApiResponse<dynamic>> TenantAdminActivePassive(TenantAndSystemAdminDTO tenantAndSystemAdminDTO)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/TenantAdminActivePassive", Method.Post);
                req.AddJsonBody(tenantAndSystemAdminDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> TenantAndSystemAdminActivePassive(TenantAndSystemAdminDTO tenantAndSystemAdminDTO)
        {
            ApiResponse<dynamic> result = null;

            if (tenantAndSystemAdminDTO.RoleIds.Contains((Int64)Roles.SystemAdmin))
            {
                var result1 = await SystemAdminActivePassive(new SystemAdminDTO { Id = tenantAndSystemAdminDTO.Id, UserId = tenantAndSystemAdminDTO.UserId });

                result = new ApiResponse<dynamic>
                {
                    IsSuccess = result1.IsSuccess,
                    Message = result1.Message
                };

                if (!result1.IsSuccess)
                {
                    return result;
                }
            }

            if (tenantAndSystemAdminDTO.RoleIds.Contains((Int64)Roles.TenantAdmin))
            {
                result = await TenantAdminActivePassive(tenantAndSystemAdminDTO);
            }

            return result;
        }

        public async Task<RestResponse<List<SystemUserModel>>> GetTenantAndSystemAdminUserList(Int64 id)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/GetTenantAndSystemAdminUserList", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync<List<SystemUserModel>>(req);
                return result;
            }
        }
        #endregion

        #region SSO
        private async Task<RestResponse<int>> GetUserTenantCount(Int64 userId)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/GetUserTenantCount", Method.Get);
                req.AddParameter("userId", userId);
                var result = await client.ExecuteAsync<int>(req);
                return result;
            }
        }

        private async Task<RestResponse<int>> GetUserStudyCount(Int64 userId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetUserStudyCount", Method.Get);
                req.AddParameter("userId", userId);
                var result = await client.ExecuteAsync<int>(req);
                return result;
            }
        }

        public async Task<RestResponse<SSOModel>> GetTenantOrStudy(Int64 userId)
        {
            RestRequest restRequest = new RestRequest();

            var tenantCount = await GetUserTenantCount(userId);

            if (!tenantCount.IsSuccessful && tenantCount.Data == null)
            {
                return new RestResponse<SSOModel>(restRequest)
                {
                    Data = null,
                    StatusCode = HttpStatusCode.InternalServerError
                };
            }

            var studyCount = await GetUserStudyCount(userId);

            if (!studyCount.IsSuccessful && studyCount.Data == null)
            {
                return new RestResponse<SSOModel>(restRequest)
                {
                    Data = null,
                    StatusCode = HttpStatusCode.InternalServerError
                };
            }

            return new RestResponse<SSOModel>(restRequest)
            {
                Data = new SSOModel { TenantCount = tenantCount.Data, StudyCount = studyCount.Data},
                StatusCode = HttpStatusCode.OK
            };
        }

        private async Task<List<SSOUserTenantModel>> GetAuthUserTenantList(Int64 userId)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/GetUserTenantList", Method.Get);
                req.AddParameter("userId", userId);
                var result = await client.ExecuteAsync<List<SSOUserTenantModel>>(req);
                return result.Data;
            }
        }

        private async Task<List<SSOUserTenantModel>> GetTenantsList(List<Int64> tenantIds)
        {
            using (var client = AuthServiceClient)
            {
                string tenantIdsString = string.Join(",", tenantIds);
                var req = new RestRequest("AuthAccount/GetTenantList", Method.Get);
                req.AddParameter("tenantIds", tenantIdsString);
                var result = await client.ExecuteAsync<List<SSOUserTenantModel>>(req);
                return result.Data;
            }
        }

        private async Task<List<SSOUserTenantModel>> GetCoreUserTenantList(Int64 userId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetUserTenantList", Method.Get);
                req.AddParameter("userId", userId);
                var result = await client.ExecuteAsync<List<Int64>>(req);
                
                if (result.IsSuccessful)
                {
                    return await GetTenantsList(result.Data);
                }
                else
                {
                    return new List<SSOUserTenantModel>();
                }
            }
        }

        public async Task<List<SSOUserTenantModel>> GetUserTenantList(Int64 userId, Roles role)
        {
            if (Roles.TenantAdmin == role)
            {
                return await GetAuthUserTenantList(userId);
            }
            else if (Roles.StudyUser == role)
            {
                return await GetCoreUserTenantList(userId);
            }
            else
            {
                return new List<SSOUserTenantModel>();
            }
        }

        public async Task<List<SSOUserStudyModel>> GetUserStudiesList(Int64 tenantId, Int64 userId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreUser/GetUserStudiesList", Method.Get);
                req.AddParameter("tenantId", tenantId);
                req.AddParameter("userId", userId);
                var result = await client.ExecuteAsync<List<SSOUserStudyModel>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SSOLogin(SSOLoginDTO sSOLoginDTO)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AuthAccount/SSOLogin", Method.Post);
                req.AddJsonBody(sSOLoginDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion
    }
}
