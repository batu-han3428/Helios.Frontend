using Helios.Common.Enums;
using Helios.Common.Model;

namespace Helios.eCRF.Services.Interfaces
{
    public interface ICacheService
    {
        List<PermissionRedisModel> GetPermissions(PermissionPage permissionPage);
    }
}
