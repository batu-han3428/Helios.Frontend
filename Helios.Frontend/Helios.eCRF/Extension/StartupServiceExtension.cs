using Helios.eCRF.Services.Interfaces;
using Helios.eCRF.Services;
using Helios.eCRF.Helpers;
using Helios.eCRF.Models;
using StackExchange.Redis;

namespace Helios.eCRF.Extension
{
    public static class StartupServiceExtension
    {
        private static IConfiguration Configuration;
        public static IServiceCollection DefaultConfigurationService(this IServiceCollection services, IConfiguration Configuration)
        {
            services.AddHttpContextAccessor();
            services.AddSingleton<IConnectionMultiplexer>(provider =>
            {
                var redisOptions = Configuration.GetSection("Redis").Get<RedisOptions>();
                var connectionString = $"{redisOptions.Host}:{redisOptions.Port},password={redisOptions.Password},abortConnect=false";
                return ConnectionMultiplexer.Connect(connectionString);
            });

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IStudyService, StudyService>();
            services.AddScoped<IModuleService, ModuleService>();
            services.AddScoped<ICacheService, CacheService>();
            services.AddScoped<TimeZoneHelper>();
            return services;
        }
    }
}
