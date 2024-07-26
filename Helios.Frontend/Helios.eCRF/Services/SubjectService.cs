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

        public async Task<RestResponse<List<SubjectDTO>>> GetSubjectList(Int64 studyId, bool showArchivedSubjects)
        {
            var dto = new SubjectListFilterDTO()
            {
                StudyId = studyId,
                UserId = UserId,
                ShowArchivedSubjects = showArchivedSubjects,
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectList", Method.Get);
                req.AddJsonBody(dto);
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

        public async Task<List<SubjectDetailMenuModel>> GetSubjectDetailMenu(Int64 studyId, Int64 subjectId)
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

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetRelationHidePage", Method.Get);
                req.AddParameter("subjectId", subjectId);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<Int64>>(req);

                if (result.IsSuccessful)
                {
                    RemoveHiddenPages(retResult, result.Data);
                }
            }

            return retResult;
        }

        public async Task<UserPermissionModel> GetUserPermissions(Int64 studyId)
        {
            var retResult = new UserPermissionModel();

            using (var client = SharedServiceClient)
            {
                var req = new RestRequest("Cache/GetUserPermissions", Method.Get);
                req.AddParameter("studyId", studyId);
                req.AddParameter("userId", UserId);
                var result = await client.ExecuteAsync<UserPermissionModel>(req);
                retResult = result.Data;
            }


            if (retResult == null)
            {
                using (var client = CoreServiceClient)
                {
                    var req = new RestRequest("CoreSubject/SetUserPermissions", Method.Get);
                    req.AddParameter("studyId", studyId);
                    req.AddParameter("userId", UserId);
                    var result = await client.ExecuteAsync<UserPermissionModel>(req);
                    retResult = result.Data;
                }
            }

            return retResult;
        }

        private static void RemoveHiddenPages(List<SubjectDetailMenuModel> menus, List<Int64> hidePages)
        {
            menus.RemoveAll(menu =>
            {
                if (menu.Children != null)
                {
                    menu.Children.RemoveAll(child =>
                    {
                        RemoveHiddenPagesRecursive(child, hidePages);
                        return hidePages.Contains(child.Id);
                    });

                    return menu.Children.Count == 0;
                }

                return hidePages.Contains(menu.Id);
            });
        }

        private static void RemoveHiddenPagesRecursive(SubjectDetailMenuModel menu, List<long> hidePages)
        {
            if (menu.Children != null)
            {
                menu.Children.RemoveAll(child =>
                {
                    RemoveHiddenPagesRecursive(child, hidePages);
                    return hidePages.Contains(child.Id);
                });
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

                if (result.IsSuccessful && result.Data.Count > 0)
                {
                    var targetElementIds = result.Data
                        .Where(x => x.IsDependent || (x.ChildElements != null && x.ChildElements.Any(ce => ce.IsDependent)))
                        .SelectMany(x => new[] { x.StudyVisitPageModuleElementId }
                                         .Concat(x.ChildElements != null ? x.ChildElements.Where(ce => ce.IsDependent).Select(ce => ce.StudyVisitPageModuleElementId) : Enumerable.Empty<Int64>()))
                        .Distinct();
                    string targetElementIdsString = string.Join(",", targetElementIds);

                    if (!String.IsNullOrEmpty(targetElementIdsString))
                    {
                        var req1 = new RestRequest("CoreStudy/GetDependentHideElement", Method.Get);
                        req1.AddParameter("targetElementString", targetElementIdsString);
                        req1.AddParameter("pageId", subjectVisitModulePageId);
                        req1.AddParameter("subjectId", subjectId);
                        var result1 = await client.ExecuteAsync<List<Int64>>(req1);
                        if (result1.IsSuccessful && result1.Data.Count > 0)
                        {
                            string elementIds = string.Join(",", result1.Data);
                            var req2 = new RestRequest("CoreSubject/SetDependentElementValue?elementIdString="+elementIds+ "&pageId="+subjectVisitModulePageId+ "&subjectId="+ subjectId, Method.Post);
                            AddApiHeaders(req2);
                            var result2 = await client.ExecuteAsync<bool>(req2);

                            if (result2.IsSuccessful && result2.Data) RemoveHiddenElements(result.Data, result1.Data);
                        }
                    }
                }
                
                return result;
            }
        }

        private static void RemoveHiddenElements(List<SubjectElementModel> data, List<long> hideElements)
        {
            data.ForEach(element =>
            {
                if (element.ChildElements != null)
                {
                    element.ChildElements.RemoveAll(child => hideElements.Contains(child.SubjectVisitPageModuleElementId));
                }
            });

            data.RemoveAll(element => hideElements.Contains(element.SubjectVisitPageModuleElementId));
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

        public async Task<ApiResponse<dynamic>> AddDatagridSubjectElements(List<SubjectVisitPageModuleElementModel> model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/AddDatagridSubjectElements", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> RemoveDatagridSubjectElements(List<Int64> elementIds)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/RemoveDatagridSubjectElements", Method.Post);
                req.AddJsonBody(elementIds);
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
            if (model.IsArchived)
            {
                using (var client = CoreServiceClient)
                {
                    var req = new RestRequest("CoreSubject/UnArchiveSubject", Method.Post);
                    req.AddJsonBody(model);
                    var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                    return result.Data;
                }
            }
            else
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
}
