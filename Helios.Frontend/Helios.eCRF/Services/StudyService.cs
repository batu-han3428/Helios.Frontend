using Helios.Common.DTO;
using Helios.Common.Model;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using RestSharp;
using System.Runtime.CompilerServices;

namespace Helios.eCRF.Services
{
    public class StudyService : ApiBaseService, IStudyService
    {
        public StudyService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        #region Study
        public async Task<RestResponse<List<StudyDTO>>> GetStudyList(bool isLock)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyList", Method.Get);
                req.AddParameter("isLock", isLock);
                var result = await client.ExecuteAsync<List<StudyDTO>>(req);
                return result;
            }
        }

        public async Task<RestResponse<StudyDTO>> GetStudy()
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudy", Method.Get);
                req.AddParameter("studyId", StudyId);
                var result = await client.ExecuteAsync<StudyDTO>(req);
                return result;
            }
        }

        private async Task<string?> GetTenantStudyLimit(Int64 tenantId)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/GetTenantStudyLimit", Method.Get);
                req.AddParameter("tenantId", tenantId);
                var result = await client.ExecuteAsync<string?>(req);
                return result.Data;
            }
        }

        private async Task<ApiResponse<dynamic>> SetStudy(StudyModel studyModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/StudySave", Method.Post);
                req.AddJsonBody(studyModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> StudySave(StudyModel studyModel)
        {
            if(studyModel.StudyId == 0)
            {
                string? studyLimit = await GetTenantStudyLimit(studyModel.TenantId);
                studyModel.StudyLimit = studyLimit;
            }
            return await SetStudy(studyModel);
        }

        public async Task<ApiResponse<dynamic>> StudyLockOrUnlock(StudyLockDTO studyLockDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/StudyLockOrUnlock", Method.Post);
                req.AddJsonBody(studyLockDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Site
        public async Task<RestResponse<List<SiteDTO>>> GetSiteList(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetSiteList", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<SiteDTO>>(req);
                return result;
            }
        }

        public async Task<RestResponse<SiteDTO>> GetSite(Int64 siteId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetSite", Method.Get);
                req.AddParameter("siteId", siteId);
                var result = await client.ExecuteAsync<SiteDTO>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SiteSaveOrUpdate(SiteModel siteModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SiteSaveOrUpdate", Method.Post);
                req.AddJsonBody(siteModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SiteDelete(SiteModel siteModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SiteDelete", Method.Post);
                req.AddJsonBody(siteModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Mail Template
        public async Task<RestResponse<List<EmailTemplateModel>>> GetEmailTemplateList(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetEmailTemplateList", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<EmailTemplateModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteEmailTemplate(BaseDTO emailTemplateDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteEmailTemplate", Method.Post);
                req.AddJsonBody(emailTemplateDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<EmailTemplateModel>> GetEmailTemplate(Int64 templateId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetEmailTemplate", Method.Get);
                req.AddParameter("templateId", templateId);
                var result = await client.ExecuteAsync<EmailTemplateModel>(req);
                return result;
            }
        }

        public async Task<RestResponse<List<EmailTemplateTagModel>>> GetEmailTemplateTagList(Int64 tenantId, int templateType)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetEmailTemplateTagList", Method.Get);
                req.AddParameter("tenantId", tenantId);
                req.AddParameter("templateType", templateType);
                var result = await client.ExecuteAsync<List<EmailTemplateTagModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> AddEmailTemplateTag(EmailTemplateTagDTO emailTemplateTagDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/AddEmailTemplateTag", Method.Post);
                req.AddJsonBody(emailTemplateTagDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteEmailTemplateTag(EmailTemplateTagDTO emailTemplateTagDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteEmailTemplateTag", Method.Post);
                req.AddJsonBody(emailTemplateTagDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetEmailTemplate(EmailTemplateDTO emailTemplateDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetEmailTemplate", Method.Post);
                req.AddJsonBody(emailTemplateDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Visit
        public async Task<RestResponse<List<VisitModel>>> GetVisits(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisits", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<VisitModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetVisits(VisitDTO visitDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisits", Method.Post);
                req.AddJsonBody(visitDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteVisits(VisitDTO visitDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteVisits", Method.Post);
                req.AddJsonBody(visitDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetVisitPageEPro(VisitDTO visitDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisitPageEPro", Method.Post);
                req.AddJsonBody(visitDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion
    }
}
