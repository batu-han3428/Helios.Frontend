﻿using Helios.eCRF.Services.Interfaces;
using RestSharp;
using System.IdentityModel.Tokens.Jwt;

namespace Helios.eCRF.Services.Base
{
    public class ApiBaseService : IApiBaseService
    {
        protected readonly IConfiguration configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ApiBaseService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            this.configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            OnServiceInstanceCreated();
        }

        public Int64 UserId { get; set; }
        public Int64 StudyId { get; set; }
        public Int64 TenantId { get; set; }
        public string Name { get; set; }
        public string Token { get; set; }

        protected RestClient AuthServiceClient {
            get { return new RestClient(new Uri("http://authentication:8080")); }
        }
        
        protected RestClient CoreServiceClient {
            get { return new RestClient(new Uri("http://core:8080")); }
        }

        protected RestClient SharedServiceClient {
            get { return new RestClient(new Uri("http://shared:8080")); }
        }

        public void OnServiceInstanceCreated()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var jwtToken = httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (jwtToken != "")
            {
                Token = jwtToken;
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(jwtToken);
                var userId = token.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
                var studyId = token.Claims.FirstOrDefault(c => c.Type == "studyId")?.Value;
                var tenantId = token.Claims.FirstOrDefault(c => c.Type == "tenantId")?.Value;
                var name = token.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
                UserId = userId != null && userId != "" ? Convert.ToInt64(userId) : 0;
                StudyId = studyId != null && studyId != "" ? Convert.ToInt64(studyId) : 0;
                TenantId = tenantId != null && tenantId != "" ? Convert.ToInt64(tenantId) : 0;
                Name = name != null && name != "" ? name : "";
            }
        }

        protected void AddApiHeaders(RestRequest req)
        {
            req.AddHeader("Authorization", UserId);
            req.AddHeader("StudyId", StudyId);
            req.AddHeader("TenantId", TenantId);
        }
    }
}
