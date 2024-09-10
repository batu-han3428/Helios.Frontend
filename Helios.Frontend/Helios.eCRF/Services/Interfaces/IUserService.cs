using Helios.eCRF.Models;
using Helios.Common.DTO;
using Helios.Common.Model;
using RestSharp;
using Helios.Common.Enums;

namespace Helios.eCRF.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDTO> GetUserByEmail(string mail);
        Task<RestResponse<List<AspNetUserDTO>>> GetUserList(List<Int64> AuthUserIds);
        Task<RestResponse<StudyUserDTO>> GetStudyUserSites(Int64 authUserId, Int64 studyId);
        Task<dynamic> AddUser(UserDTO model);
        Task<bool> PassiveOrActiveUser(UserDTO model);
        Task<ApiResponse<dynamic>> UpdateUser(AspNetUserDTO model);
        Task<bool> AddRole(UserDTO model);
        Task<RestResponse<List<TenantModel>>> GetTenantList();
        Task<ApiResponse<dynamic>> AddOrUpdatePermissionRole(UserPermissionRoleModel userPermission);
        Task<ApiResponse<dynamic>> DeleteRole(UserPermissionRoleModel userPermission);
        Task<RestResponse<List<RoleVisitPermissionsModel>>> GetPermissionsVisitList(Int64 roleId);
        Task<ApiResponse<dynamic>> SetPermissionsVisitPage(PermissionsRoleVisitPageDTO dto);
        Task<RestResponse<List<UserPermissionDTO>>> GetPermissionRoleList(Int64 studyId);
        Task<ApiResponse<dynamic>> SetPermission(StudyUserRolePermissionDTO dto);
        Task<UserPermissionModel> GetUserPermissions(Int64 studyId);
        Task<RestResponse<bool>> GetHasRole(Int64 studyId);   
        Task<RestResponse<List<StudyUserDTO>>> GetStudyUserList(Int64 studyId);
        Task<ApiResponse<dynamic>> SetStudyUser(StudyUserModel studyUserModel);
        Task<ApiResponse<dynamic>> ActivePassiveStudyUser(StudyUserModel studyUserModel);
        Task<ApiResponse<dynamic>> ActivePassiveStudyUsers(StudyUserModel studyUserModel);
        Task<ApiResponse<dynamic>> ActivePassiveByAuthUserId(Int64 authUserId, Int64 tenantId);
        Task<ApiResponse<DeleteStudyUserDTO>> DeleteStudyUser(StudyUserModel studyUserModel);
        Task<ApiResponse<dynamic>> UserResetPassword(StudyUserModel model);
        Task<ApiResponse<dynamic>> UserProfileChangePassword(ResetUserProfileViewModel model);
        Task<ApiResponse<StudyUserDTO>> GetStudyUser(string email, Int64 studyId);
        Task<RestResponse<List<UserPermissionDTO>>> GetRoleList(Int64 studyId);
        Task<RestResponse<TenantUserListDTO>> GetTenantUserList(Int64 tenantId);
        Task<ApiResponse<dynamic>> SetTenantUser(TenantUserModel studyUserModel);
        Task<RestResponse<SSOModel>> GetTenantOrStudy(Int64 userId);
        Task<List<SSOUserTenantModel>> GetUserTenantList(Int64 userId, Roles role);
        Task<List<SSOUserStudyModel>> GetUserStudiesList(Int64 tenantId, Int64 userId);
        Task<ApiResponse<dynamic>> SSOLogin(SSOLoginDTO sSOLoginDTO);
        Task<RestResponse<List<UserRoleModel>>> GetRoleUsers(Int64 roleId);
        Task<RestResponse<List<UserRoleModel>>> GetStudyRoleUsers(Int64 studyId);
        Task<ApiResponse<SystemAdminDTO>> SetSystemAdminUser(SystemAdminDTO systemAdminDTO);
        Task<RestResponse<List<SystemUserModel>>> GetSystemAdminUserList();
        Task<ApiResponse<dynamic>> SystemAdminActivePassive(SystemAdminDTO systemAdminDTO);
        Task<ApiResponse<dynamic>> SystemAdminResetPassword(SystemAdminDTO systemAdminDTO);
        Task<ApiResponse<dynamic>> SystemAdminDelete(SystemAdminDTO systemAdminDTO);
        Task<ApiResponse<dynamic>> SetTenant(TenantDTO tenantDTO);
        Task<RestResponse<TenantModel>> GetTenant(Int64 tenantId);
        Task<ApiResponse<dynamic>> SetSystemAdminAndTenantAdminUser(SystemAdminDTO systemAdminDTO);
        Task<ApiResponse<dynamic>> SetAspNetUser(AspNetUserDTO model);
        Task<RestResponse<List<SystemUserModel>>> GetTenantAndSystemAdminUserList(Int64 id);
        Task<RestResponse<List<SystemUserModel>>> GetTenantAdminUserList(Int64 id);
        Task<RestResponse<List<TenantModel>>> GetAuthTenantList();
        Task<ApiResponse<dynamic>> TenantAndSystemAdminDelete(TenantAndSystemAdminDTO tenantAndSystemAdminDTO);
        Task<ApiResponse<dynamic>> TenantAndSystemAdminActivePassive(TenantAndSystemAdminDTO tenantAndSystemAdminDTO);
        Task<ApiResponse<dynamic>> TenantAdminActivePassive(TenantAndSystemAdminDTO tenantAndSystemAdminDTO);
    }
}
