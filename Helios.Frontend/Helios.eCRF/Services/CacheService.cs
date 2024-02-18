using Helios.Common.Enums;
using Helios.eCRF.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using StackExchange.Redis;

namespace Helios.eCRF.Services
{
    public class PermissionInfo
    {
        public int Key { get; set; }
        public string Name { get; set; }
    }
    public class CacheService: ICacheService
    {
        private readonly IConnectionMultiplexer _redisCache;
        private readonly IMemoryCache _localCache;

        public CacheService(IConnectionMultiplexer redisCache, IMemoryCache localCache)
        {
            _redisCache = redisCache;
            _localCache = localCache;
        }

        public List<PermissionInfo> GetPermissions(PermissionPage permissionPage)
        {
            var localCacheKey = $"permissions:{permissionPage}";

            if (_localCache.TryGetValue(localCacheKey, out List<PermissionInfo> cachedPermissions))
            {
                return cachedPermissions;
            }

            try
            {
                cachedPermissions = GetPermissionsFromRedis(permissionPage);

                if (cachedPermissions == null || cachedPermissions.Count == 0)
                {

                    cachedPermissions = GetDefaultPermissions(permissionPage);

                    SetPermissionsToRedis(permissionPage, cachedPermissions);

                    _localCache.Set(localCacheKey, cachedPermissions, new TimeSpan(0, 10, 0)); 
                }

                return cachedPermissions;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                return GetDefaultPermissions(permissionPage);
            }
        }

        private List<PermissionInfo> GetPermissionsFromRedis(PermissionPage pageKey)
        {
            var db = _redisCache.GetDatabase();

            RedisValue[] values = db.HashValues($"permissions:{pageKey}");

            List<PermissionInfo> permissions = new List<PermissionInfo>();
            foreach (var value in values)
            {
                var permission = Newtonsoft.Json.JsonConvert.DeserializeObject<PermissionInfo>(value);
                permissions.Add(permission);
            }

            return permissions;
        }

        private void SetPermissionsToRedis(PermissionPage pageKey, List<PermissionInfo> permissions)
        {
            var db = _redisCache.GetDatabase();

            foreach (var permission in permissions)
            {
                db.HashSet($"permissions:{pageKey}", permission.Key.ToString(), Newtonsoft.Json.JsonConvert.SerializeObject(permission));
            }
        }

        private List<PermissionInfo> GetDefaultPermissions(PermissionPage pageKey)
        {
            if (pageKey == PermissionPage.User)
            {
                return new List<PermissionInfo>
                {
                    new PermissionInfo { Key = 1, Name = "View Users" },
                    new PermissionInfo { Key = 2, Name = "Edit Users" }
                };
            }
            else if (pageKey == PermissionPage.Visit)
            {
                return new List<PermissionInfo>
                {
                    new PermissionInfo { Key = 3, Name = "Freeze" },
                    new PermissionInfo { Key = 4, Name = "Lock" },
                    new PermissionInfo { Key = 5, Name = "Signature" },
                    new PermissionInfo { Key = 6, Name = "SDV" },
                    new PermissionInfo { Key = 7, Name = "Query" },
                    new PermissionInfo { Key = 8, Name = "Verification" },
                    new PermissionInfo { Key = 9, Name = "SAE Lock" },
                };
            }

            return new List<PermissionInfo>();
        }
    }
}
