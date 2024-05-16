using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Caching.Memory;
using RestSharp;
using StackExchange.Redis;

namespace Helios.eCRF.Services
{
    public class CacheService : ApiBaseService, ICacheService
    {
        private readonly IConnectionMultiplexer _redisCache;
        private readonly IMemoryCache _localCache;

        public CacheService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IConnectionMultiplexer redisCache, IMemoryCache localCache) : base(configuration, httpContextAccessor)
        {
            _redisCache = redisCache;
            _localCache = localCache;
        }

        public async Task<ApiResponse<dynamic>> SetSubjectDetailMenu(Int64 studyId)
        {
            var response = new ApiResponse<dynamic>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/SetSubjectDetailMenu", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<SubjectDetailMenuModel>>(req);

                string prefix = "Study";
                var localCacheKey = prefix + ":" + studyId;

                if (result != null)
                {
                    _localCache.Set(localCacheKey, result.Content, new TimeSpan(0, 10, 0));
                }
            }

            return response;
        }

        public async Task<List<SubjectDetailMenuModel>> GetSubjectDetailMenu(Int64 studyId)
        {
            string prefix = "Study";
            var localCacheKey = prefix + ":" + studyId;

            bool v = _localCache.TryGetValue(localCacheKey, out List<SubjectDetailMenuModel> SubjectDetailMenu);

            if (v)
            {
                return SubjectDetailMenu;
            }

            return null;
        }

        public List<PermissionModel> GetPermissions(PermissionPage permissionPage)
        {
            var localCacheKey = $"permissions:{permissionPage}";

            if (_localCache.TryGetValue(localCacheKey, out List<PermissionModel> cachedPermissions))
            {
                return cachedPermissions;
            }

            try
            {
                cachedPermissions = GetPermissionsFromRedis(permissionPage);

                if (cachedPermissions == null || cachedPermissions.Count == 0)
                {

                    //cachedPermissions = GetDefaultPermissions(permissionPage);

                    SetPermissionsToRedis(permissionPage, cachedPermissions);

                    _localCache.Set(localCacheKey, cachedPermissions, new TimeSpan(0, 10, 0));
                }

                return cachedPermissions;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw ex;
                //return GetDefaultPermissions(permissionPage);
            }
        }

        private List<PermissionModel> GetPermissionsFromRedis(PermissionPage pageKey)
        {
            try
            {
                var db = _redisCache.GetDatabase();
                RedisValue[] values = db.HashValues($"permissions:{pageKey}");

                List<PermissionModel> permissions = new List<PermissionModel>();
                foreach (var value in values)
                {
                    var permission = Newtonsoft.Json.JsonConvert.DeserializeObject<PermissionModel>(value);
                    permissions.Add(permission);
                }

                return permissions;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void SetPermissionsToRedis(PermissionPage pageKey, List<PermissionModel> permissions)
        {
            var db = _redisCache.GetDatabase();

            foreach (var permission in permissions)
            {
                //db.HashSet($"permissions:{pageKey}", permission.Key.ToString(), Newtonsoft.Json.JsonConvert.SerializeObject(permission));
            }
        }

        //private List<PermissionModel> GetDefaultPermissions(PermissionPage pageKey)
        //{
        //    if (pageKey == PermissionPage.User)
        //    {
        //        return new List<PermissionModel>
        //        {
        //            new PermissionModel { Key = 1, Name = "View Users" },
        //            new PermissionModel { Key = 2, Name = "Edit Users" }
        //        };
        //    }
        //    else if (pageKey == PermissionPage.Visit || pageKey == PermissionPage.Page)
        //    {
        //        return new List<PermissionModel>
        //        {
        //            new PermissionModel { Key = 3, Name = "Freeze" },
        //            new PermissionModel { Key = 4, Name = "Lock" },
        //            new PermissionModel { Key = 5, Name = "Signature" },
        //            new PermissionModel { Key = 6, Name = "SDV" },
        //            new PermissionModel { Key = 7, Name = "Query" },
        //            new PermissionModel { Key = 8, Name = "Verification" }
        //        };
        //    }

        //    return new List<PermissionModel>();
        //}
    }
}
