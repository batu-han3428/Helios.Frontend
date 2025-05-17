﻿using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;
using Helios.eCRF.Attributes;
using Helios.eCRF.Models;
using Helios.eCRF.Services;
using Helios.eCRF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;
using System.Text.RegularExpressions;

namespace Helios.eCRF.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            this._userService = userService;
        }

        /// <summary>
        /// kullanıcının mail adresine göre bilgilerini getirir
        /// </summary>
        /// <param name="mail">kullanıcının mail adresi</param>
        /// <returns>kullanıcının bilgileri</returns>
        [HttpGet]
        public async Task<UserDTO> GetUserByEmail(string mail)
        {
            var result = await _userService.GetUserByEmail(mail);
            return result;
        }


        /// <summary>
        /// admin kayıt eder
        /// </summary>
        /// <param name="model">kayıt edilecek kullanıcının bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SaveAdminUser(UserDTO model)
        {
            if (model.Id == 0)
            {
                var result = await _userService.AddUser(model);
                return Ok(result);
            }
            else
            {
                //var result = await _userService.UpdateUser(model);
                return Ok(/*result*/);
            }
        }


        /// <summary>
        /// seçili kullanıcının durumunu aktif yada pasif olarak ayarlar
        /// </summary>
        /// <param name="model">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        /// <param name="id">tenant id</param>
        /// <returns>tenant bilgisi</returns>
        [HttpPost]
        public async Task<IActionResult> PassiveOrActiveUser(UserDTO model)
        {
            var result = await _userService.PassiveOrActiveUser(model);
            return Ok(result);
        }

        #region Tenants

        /// <summary>
        /// tenantları çalışma sayılarıyla listeler
        /// </summary>
        /// <returns>tenant listesi</returns>
        [HttpGet]
        public async Task<IActionResult> GetTenantList()
        {
            var result = await _userService.GetTenantList();
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// tenantları listeler
        /// </summary>
        /// <returns>tenant listesi</returns>
        [HttpGet]
        public async Task<IActionResult> GetAuthTenantList()
        {
            var result = await _userService.GetAuthTenantList();
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// seçili tenant bilgilerini getirir
        /// </summary>
        /// <param name="tenantId">tenant id</param>
        /// <returns>tenant bilgileri</returns>
        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetTenant(Int64 tenantId)
        {
            var result = await _userService.GetTenant(tenantId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// tenant siler ya da günceller
        /// </summary>
        /// <param name="model">tenant bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SetTenant([FromForm] TenantDTO tenantDTO)
        {
            var result = await _userService.SetTenant(tenantDTO);
            return Ok(result);
        }
        #endregion

        #region Permissions

        /// <summary>
        /// Admin panelinde permissions sayfasındaki yetkileri listeler
        /// </summary>
        /// <returns>yetki listesi</returns>
        [HttpGet]
        [ResponseCache(Duration = 3600)]
        public IActionResult GetStudyRolePermissionsList()
        {
            try
            {
                var enumValues = new Dictionary<string, Dictionary<string, int>>();

                foreach (StudyRolePermission permission in Enum.GetValues(typeof(StudyRolePermission)))
                {
                    var descriptionAttribute = permission.GetType().GetField(permission.ToString()).GetCustomAttributes(typeof(DescriptionAttribute), false).FirstOrDefault() as DescriptionAttribute;

                    var groupName = permission.ToString().Split('_')[0];
                    var permissionKey = descriptionAttribute?.Description ?? permission.ToString();
                    var permissionValue = (int)permission;

                    groupName = Regex.Replace(groupName, "(?<=[a-z])(?=[A-Z])", " ");
                    groupName = char.ToUpper(groupName[0]) + groupName.Substring(1);
                    groupName = Regex.Replace(groupName, "\\s(\\w+)", m => m.Value.ToLower());

                    if (!enumValues.ContainsKey(groupName))
                    {
                        enumValues[groupName] = new Dictionary<string, int>();
                    }
                    enumValues[groupName][permissionKey] = permissionValue;
                }

                return Ok(enumValues);
            }
            catch (Exception)
            {
                return StatusCode(500, "Unsuccessful");
            }
        }

        /// <summary>
        /// çalışmanın rol ve yetkilerini getirir
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>rol ve yetkiler</returns>
        [HttpGet("{studyId}")]
        public async Task<IActionResult> GetPermissionRoleList(Int64 studyId)
        {
            var result = await _userService.GetPermissionRoleList(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        [HttpGet("{studyId}")]
        //[Authorize(Roles = "StudyUser")]
        public async Task<IActionResult> GetUserPermissions(Int64 studyId)
        {
            var result = await _userService.GetUserPermissions(studyId);
            return new ObjectResult(result);
        }
        [HttpGet("{studyId}")]
        public async Task<IActionResult> GetHasRole(Int64 studyId)
        {
            var result = await _userService.GetHasRole(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }
        /// <summary>
        /// çalışmanın rollerini getirir
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>roller</returns>
        [HttpGet("{studyId}")]
        public async Task<IActionResult> GetRoleList(Int64 studyId)
        {
            var result = await _userService.GetRoleList(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// rolün kullanıcılarını getirir
        /// </summary>
        /// <param name="roleId">rol id</param>
        /// <returns>rolün kullanıcıları</returns>
        [HttpGet("{roleId}")]
        public async Task<IActionResult> GetRoleUsers(Int64 roleId)
        {
            var result = await _userService.GetRoleUsers(roleId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// çalışmadaki kullanıcıları ve rollerini listeler
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>çalışmada ki kullanıcılar ve rolleri</returns>
        [HttpGet("{studyId}")]
        public async Task<IActionResult> GetStudyRoleUsers(Int64 studyId)
        {
            var result = await _userService.GetStudyRoleUsers(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// yetki günceller
        /// </summary>
        /// <param name="dto">yetki bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SetPermission(StudyUserRolePermissionDTO dto)
        {
            var result = await _userService.SetPermission(dto);
            return Ok(result);
        }


        /// <summary>
        /// rol ekler ya da günceller
        /// </summary>
        /// <param name="userPermission">rol bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> AddOrUpdatePermissionRole(UserPermissionRoleModel userPermission)
        {
            var result = await _userService.AddOrUpdatePermissionRole(userPermission);
            return Ok(result);
        }


        /// <summary>
        /// rol siler
        /// </summary>
        /// <param name="userPermission">rol bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> DeleteRole(UserPermissionRoleModel userPermission)
        {
            var result = await _userService.DeleteRole(userPermission);
            return Ok(result);
        }


        /// <summary>
        /// rolün visit ve sayfa yetkilerini listeler
        /// </summary>
        /// <param name="roleId">seçili rol id</param>
        /// <returns>yetki visit listesi</returns>
        [HttpGet("{roleId}")]
        public async Task<IActionResult> GetPermissionsVisitList(Int64 roleId)
        {
            var result = await _userService.GetPermissionsVisitList(roleId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// rolün visit veya sayfa yetkisini günceller
        /// </summary>
        /// <param name="dto">yetki ve rol bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SetPermissionsVisitPage(PermissionsRoleVisitPageDTO dto)
        {
            var result = await _userService.SetPermissionsVisitPage(dto);
            return Ok(result);
        }
        #endregion

        #region Study User

        /// <summary>
        /// çalışmanın kullanıcılarını listeler
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>kullanıcılar</returns>
        [HttpGet("{studyId}")]
        public async Task<IActionResult> GetStudyUserList(Int64 studyId)
        {
            var result = await _userService.GetStudyUserList(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        [HttpGet("{authUserId}/{studyId}")]
        public async Task<IActionResult> GetStudyUserSites(Int64 authUserId, Int64 studyId)
        {
            var result = await _userService.GetStudyUserSites(authUserId, studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }
        /// <summary>
        /// mail adresi girilen kullanıcının bilgilerini getirir. kullanıcı yoksa boş döner. kullanıcı çalışmada kayıtlı ise uyarı döner
        /// </summary>
        /// <param name="email">kullanıcı email</param>
        /// <param name="studyId">çalışma id</param>
        /// <returns>kullanıcı bilgisi ya da uyarı</returns>
        [HttpGet("{email}/{studyId}")]
        public async Task<IActionResult> GetStudyUser(string email, Int64 studyId)
        {
            var result = await _userService.GetStudyUser(email, studyId);
            return Ok(result);
        }


        /// <summary>
        /// çalışmaya kullanıcı ekler veya günceller
        /// </summary>
        /// <param name="studyUserModel">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SetStudyUser(StudyUserModel studyUserModel)
        {
            var result = await _userService.SetStudyUser(studyUserModel);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> UserProfileEdit(AspNetUserDTO userModel)
        {
            var result = await _userService.UpdateUser(userModel);
            return Ok(result);
        }

        /// <summary>
        /// seçili kullanıcıyı aktif veya pasif hale getirir
        /// </summary>
        /// <param name="studyUserModel">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> ActivePassiveStudyUser(StudyUserModel studyUserModel)
        {
            var result = await _userService.ActivePassiveStudyUser(studyUserModel);
            return Ok(result);
        }
        /// <summary>
        /// seçili mailin bütün hesaplarını aktif veya pasif hale getirir
        /// </summary>
        /// <param name="authUserId">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> ActivePassiveByAuthUserId(Int64 authUserId, Int64 tenantId)
        {
            var result = await _userService.ActivePassiveByAuthUserId(authUserId,tenantId);
            return Ok(result);
        }

        /// <summary>
        /// seçili kullanıcıları aktif veya pasif hale getirir
        /// </summary>
        /// <param name="studyUserModel">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> ActivePassiveStudyUsers(StudyUserModel studyUserModel)
        {
            var result = await _userService.ActivePassiveStudyUsers(studyUserModel);
            return Ok(result);
        }

        /// <summary>
        /// Seçili kullanıcıyı siler
        /// </summary>
        /// <param name="studyUserModel">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> DeleteStudyUser(StudyUserModel studyUserModel)
        {
            var result = await _userService.DeleteStudyUser(studyUserModel);
            return Ok(result);
        }


        /// <summary>
        /// Seçili kullanıcının şifresini sıfırlar ve mail gönderir
        /// </summary>
        /// <param name="studyUserModel">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> UserResetPassword(StudyUserModel studyUserModel)
        {
            var result = await _userService.UserResetPassword(studyUserModel);
            return Ok(result);
        }
        /// <summary>
        /// Seçili kullanıcının şifresini değiştirir.
        /// </summary>
        /// <param name="studyUserModel">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> UserProfileChangePassword(ResetUserProfileViewModel resetUserProfileViewModel)
        {
            var result = await _userService.UserProfileChangePassword(resetUserProfileViewModel);
            return Ok(result);
        }
        #endregion

        #region Tenant User

        /// <summary>
        /// tenantın kullanıcılarını listeler
        /// </summary>
        /// <param name="tenantId">tenant id</param>
        /// <returns>kullanıcılar</returns>
        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetTenantUserList(Int64 tenantId)
        {
            var result = await _userService.GetTenantUserList(tenantId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// tenant kullanıcısını günceller
        /// </summary>
        /// <param name="studyUserModel">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SetTenantUser(TenantUserModel tenantUserModel)
        {
            var result = await _userService.SetTenantUser(tenantUserModel);
            return Ok(result);
        }
        #endregion

        #region System Admin User

        /// <summary>
        /// sistem admin ekler veya günceller
        /// </summary>
        /// <param name="systemAdminDTO">sistem admin bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SetSystemAdminUser(SystemAdminDTO systemAdminDTO)
        {
            if (systemAdminDTO.isAdd.Value)
            {
                var result = await _userService.SetSystemAdminUser(systemAdminDTO);
                return Ok(result);
            }
            else
            {
                var result = await _userService.SetAspNetUser(new AspNetUserDTO { Id = systemAdminDTO.Id, Email = systemAdminDTO.Email, Name = systemAdminDTO.Name, LastName = systemAdminDTO.LastName, PhoneNumber = systemAdminDTO.PhoneNumber });
                return Ok(result);
            }
        }


        /// <summary>
        /// sistem admin kullanıcılarını listeler
        /// </summary>
        /// <returns>kullanıcılar</returns>
        [HttpGet]
        public async Task<IActionResult> GetSystemAdminUserList()
        {
            var result = await _userService.GetSystemAdminUserList();
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// seçili sistem admin kullanıcısını aktif veya pasif hale getirir
        /// </summary>
        /// <param name="systemAdminDTO">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SystemAdminActivePassive(SystemAdminDTO systemAdminDTO)
        {
            var result = await _userService.SystemAdminActivePassive(systemAdminDTO);
            return Ok(result);
        }


        /// <summary>
        /// seçili sistem admin kullanıcısının şifresini sıfırlar
        /// </summary>
        /// <param name="systemAdminDTO">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SystemAdminResetPassword(SystemAdminDTO systemAdminDTO)
        {
            var result = await _userService.SystemAdminResetPassword(systemAdminDTO);
            return Ok(result);
        }


        /// <summary>
        /// seçili sistem admin kullanıcısını siler
        /// </summary>
        /// <param name="systemAdminDTO">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SystemAdminDelete(SystemAdminDTO systemAdminDTO)
        {
            var result = await _userService.SystemAdminDelete(systemAdminDTO);
            return Ok(result);
        }
        #endregion

        #region Tenant Admin User

        /// <summary>
        /// rol seçimine göre kullanıcı ekler veya günceller
        /// </summary>
        /// <param name="systemAdminDTO">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> SetSystemAdminAndTenantAdminUser(SystemAdminDTO systemAdminDTO)
        {
            var result = await _userService.SetSystemAdminAndTenantAdminUser(systemAdminDTO);
            return Ok(result);
        }


        /// <summary>
        /// tenant admin ve sistem admin kullanıcılarını listeler
        /// </summary>
        /// <param name="id"></param>
        /// <returns>kullanıcılar</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTenantAndSystemAdminUserList(Int64 id)
        {
            var result = await _userService.GetTenantAndSystemAdminUserList(id);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }
        /// <summary>
        /// tenant admin kullanıcılarını listeler
        /// </summary>
        /// <param name="id"></param>
        /// <returns>kullanıcılar</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTenantAdminUserList(Int64 id)
        {
            var result = await _userService.GetTenantAdminUserList(id);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// seçili tenant admin ve system adminleri siler
        /// </summary>
        /// <param name="tenantAndSystemAdminDTO">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> TenantAndSystemAdminDelete(TenantAndSystemAdminDTO tenantAndSystemAdminDTO)
        {
            var result = await _userService.TenantAndSystemAdminDelete(tenantAndSystemAdminDTO);
            return Ok(result);
        }

        /// <summary>
        /// seçili tenant admin ve system adminlerin aktif/pasif durumunu ayarlar
        /// </summary>
        /// <param name="tenantAndSystemAdminDTO">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> TenantAndSystemAdminActivePassive(TenantAndSystemAdminDTO tenantAndSystemAdminDTO)
        {
            var result = await _userService.TenantAndSystemAdminActivePassive(tenantAndSystemAdminDTO);
            return Ok(result);
        }

        /// <summary>
        /// seçili tenant admin aktif/pasif durumunu ayarlar
        /// </summary>
        /// <param name="tenantAndSystemAdminDTO">kullanıcı bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<IActionResult> TenantAdminActivePassive(TenantAndSystemAdminDTO tenantAndSystemAdminDTO)
        {
            var result = await _userService.TenantAdminActivePassive(tenantAndSystemAdminDTO);
            return Ok(result);
        }
        #endregion

        #region SSO

        /// <summary>
        /// kullanıcının tenant ve studylerini kontrol eder
        /// </summary>
        /// <param name="userId">kullanıcı id</param>
        /// <returns>tenant ve study sayısı</returns>
        [HttpGet("{userId}")]
        [RoleAttribute(Roles.StudyUser, Roles.TenantAdmin)]
        public async Task<IActionResult> GetTenantOrStudy(Int64 userId)
        {
            var result = await _userService.GetTenantOrStudy(userId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// kullanıcının bulunduğu tenantları listeler
        /// </summary>
        /// <param name="userId">kullanıcı id</param>
        /// <param name="role">kullanıcı seçtiği rol</param>
        /// <returns>tenant listesi</returns>
        [HttpGet("{userId}/{role}")]
        [RoleAttribute(Roles.StudyUser, Roles.TenantAdmin)]
        public async Task<List<SSOUserTenantModel>> GetUserTenantList(Int64 userId, Roles role)
        {
            return await _userService.GetUserTenantList(userId, role);
        }

        /// <summary>
        /// kullanıcının bulunduğu çalışmaları listeler
        /// </summary>
        /// <param name="tenantId">çalışmaların bulunduğu tenant</param>
        /// <param name="userId">kullanıcı id</param>
        /// <returns>çalışma listesi</returns>
        [HttpGet("{tenantId}/{userId}")]
        [RoleAttribute(Roles.StudyUser, Roles.TenantAdmin)]
        public async Task<List<SSOUserStudyModel>> GetUserStudiesList(Int64 tenantId, Int64 userId)
        {
            return await _userService.GetUserStudiesList(tenantId, userId);
        }

        /// <summary>
        /// SSO ile login olur
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        [RoleAttribute(Roles.StudyUser, Roles.TenantAdmin)]
        public async Task<IActionResult> SSOLogin(SSOLoginDTO sSOLoginDTO)
        {
            var jwt = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            sSOLoginDTO.Jwt = jwt;

            var result = await _userService.SSOLogin(sSOLoginDTO);

            return Ok(result);
        }
        #endregion
    }
}
