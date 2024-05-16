using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;

namespace Helios.eCRF.Services.Interfaces
{
    public interface ICacheService
    {
        Task<ApiResponse<dynamic>> SetSubjectDetailMenu(Int64 studyId);
        Task<List<SubjectDetailMenuModel>> GetSubjectDetailMenu(Int64 studyId);
        List<PermissionModel> GetPermissions(PermissionPage permissionPage);
    }
}
