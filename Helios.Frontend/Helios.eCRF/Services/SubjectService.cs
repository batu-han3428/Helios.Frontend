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

        public async Task<ApiResponse<dynamic>> AddSubject(SubjectDTO SubjectDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/AddSubject", Method.Post);
                req.AddJsonBody(SubjectDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<RestResponse<List<SiteModel>>> GetSites(Int64 studyId)
        {
            var model = new SubjectDTO
            {
                StudyId = studyId,
                SiteId = 3,
                SubjectNumber = "",
                InitialName = "",
                AddedByName = "",
                Country = "",
                RandomData = "",
                SiteName = "",
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSites", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<List<SiteModel>>(req);
                return result;
            }
        }

        public async Task<List<SubjectDetailMenuModel>> GetSubjectDetailMenu(Int64 studyId)
        {
            var retResult = new List<SubjectDetailMenuModel>();

            using (var client = SharedServiceClient)
            {
                var req = new RestRequest("Cache/GetSubjectDetailMenu", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<SubjectDetailMenuModel>>(req);
                retResult = result.Data;
            }


            if (retResult == null)
            {
                using (var client = CoreServiceClient)
                {
                    var req = new RestRequest("CoreSubject/SetSubjectDetailMenu", Method.Get);
                    req.AddParameter("studyId", studyId);
                    var result = await client.ExecuteAsync<List<SubjectDetailMenuModel>>(req);
                    retResult = result.Data;
                }
            }

            return retResult;
        }

         public async Task<List<SubjectDetailMenuModel>> GetUserPermissions(Int64 studyId)
        {
            var retResult = new List<SubjectDetailMenuModel>();

            using (var client = SharedServiceClient)
            {
                var req = new RestRequest("Cache/GetSubjectDetailMenu", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<SubjectDetailMenuModel>>(req);
                retResult = result.Data;
            }


            if (retResult == null)
            {
                using (var client = CoreServiceClient)
                {
                    var req = new RestRequest("CoreSubject/SetSubjectDetailMenu", Method.Get);
                    req.AddParameter("studyId", studyId);
                    var result = await client.ExecuteAsync<List<SubjectDetailMenuModel>>(req);
                    retResult = result.Data;
                }
            }

            return retResult;
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

        public async Task<ApiResponse<dynamic>> AutoSaveSubjectData(SubjectElementShortModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/AutoSaveSubjectData", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<bool> GetStudyAskSubjectInitial(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetStudyAskSubjectInitial", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<bool>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteOrArchiveSubject(SubjectArchiveOrDeleteModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/DeleteOrArchiveSubject", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

    }
}
