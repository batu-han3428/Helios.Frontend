using Helios.Common.Enums;

namespace Helios.eCRF.Services.Interfaces
{
    public interface ICacheService
    {
        List<PermissionInfo> GetPermissions(PermissionPage permissionPage);
    }
}
