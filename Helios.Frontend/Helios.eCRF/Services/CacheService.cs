using Helios.Common.Enums;
using Helios.Common.Model;
using Helios.eCRF.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using StackExchange.Redis;

namespace Helios.eCRF.Services
{
    public class CacheService: ICacheService
    {
        private readonly IConnectionMultiplexer _redisCache;
        private readonly IMemoryCache _localCache;

        public CacheService(IConnectionMultiplexer redisCache, IMemoryCache localCache)
        {
            _redisCache = redisCache;
            _localCache = localCache;
        }

        public List<PermissionRedisModel> GetPermissions(PermissionPage permissionPage)
        {
            var localCacheKey = $"permissions:{permissionPage}";

            if (_localCache.TryGetValue(localCacheKey, out List<PermissionRedisModel> cachedPermissions))
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

        private List<PermissionRedisModel> GetPermissionsFromRedis(PermissionPage pageKey)
        {
            try
            {
                var db = _redisCache.GetDatabase();
                RedisValue[] values = db.HashValues($"permissions:{pageKey}");

                List<PermissionRedisModel> permissions = new List<PermissionRedisModel>();
                foreach (var value in values)
                {
                    var permission = Newtonsoft.Json.JsonConvert.DeserializeObject<PermissionRedisModel>(value);
                    permissions.Add(permission);
                }

                return permissions;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void SetPermissionsToRedis(PermissionPage pageKey, List<PermissionRedisModel> permissions)
        {
            var db = _redisCache.GetDatabase();

            foreach (var permission in permissions)
            {
                db.HashSet($"permissions:{pageKey}", permission.Key.ToString(), Newtonsoft.Json.JsonConvert.SerializeObject(permission));
            }
        }

        private List<PermissionRedisModel> GetDefaultPermissions(PermissionPage pageKey)
        {
            if (pageKey == PermissionPage.User)
            {
                return new List<PermissionRedisModel>
                {
                    new PermissionRedisModel { Key = 1, Name = "View Users" },
                    new PermissionRedisModel { Key = 2, Name = "Edit Users" }
                };
            }
            else if (pageKey == PermissionPage.Visit)
            {
                return new List<PermissionRedisModel>
                {
                    new PermissionRedisModel { Key = 3, Name = "Freeze" },
                    new PermissionRedisModel { Key = 4, Name = "Lock" },
                    new PermissionRedisModel { Key = 5, Name = "Signature" },
                    new PermissionRedisModel { Key = 6, Name = "SDV" },
                    new PermissionRedisModel { Key = 7, Name = "Query" },
                    new PermissionRedisModel { Key = 8, Name = "Verification" },
                    new PermissionRedisModel { Key = 9, Name = "SAE Lock" },
                };
            }

            return new List<PermissionRedisModel>();
        }
    }
}
