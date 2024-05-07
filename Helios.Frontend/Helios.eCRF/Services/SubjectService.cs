using Helios.Common.DTO;
using Helios.Common.Model;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using RestSharp;

namespace Helios.eCRF.Services
{
    public class SubjectService : ApiBaseService, ISubjectService
    {
        public SubjectService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        public async Task<RestResponse<List<SubjectDTO>>> GetSubjectList(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectList", Method.Get);
                req.AddParameter("studyId", studyId);
                req.AddParameter("userId", UserId);
                var result = await client.ExecuteAsync<List<SubjectDTO>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> AddSubject(Int64 studyId)
        {
            var model = new SubjectDTO
            {
                StudyId = studyId,
                SiteId = 3,
                SubjectNumber = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/AddSubject", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<List<SubjectDetailMenuModel>>> GetSubjectDetailMenu(Int64 subjectId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectDetailMenu", Method.Get);
                req.AddParameter("subjectId", subjectId);
                var result = await client.ExecuteAsync<List<SubjectDetailMenuModel>>(req);
                return result;
            }
        }
        public async Task<RestResponse<List<SubjectElementModel>>> GetSubjectElementList(Int64 subjectId, Int64 subjectVisitModulePageId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectElementList", Method.Get);
                req.AddParameter("subjectId", subjectId);
                req.AddParameter("pageId", subjectVisitModulePageId);
                var result = await client.ExecuteAsync<List<SubjectElementModel>>(req);
                return result;
            }
        }

    }
}
