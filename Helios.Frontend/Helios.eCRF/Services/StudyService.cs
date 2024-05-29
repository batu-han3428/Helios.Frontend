using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;
using Helios.eCRF.Hubs;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using RestSharp;

namespace Helios.eCRF.Services
{
    public class StudyService : ApiBaseService, IStudyService
    {
        private readonly IHubContext<LiveDataHub> _liveDataHub;
        public StudyService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IHubContext<LiveDataHub> liveDataHub) : base(configuration, httpContextAccessor)
        {
            _liveDataHub = liveDataHub;
        }

        #region Study
        public async Task<RestResponse<List<StudyDTO>>> GetStudyList(bool isLock,Int64 tenantId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyList", Method.Get);
                req.AddParameter("isLock", isLock);
                req.AddParameter("tenantId", tenantId);
                var result = await client.ExecuteAsync<List<StudyDTO>>(req);
                return result;
            }
        }

        public async Task<RestResponse<StudyDTO>> GetStudy(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudy", Method.Get);
                req.AddParameter("studyId", studyId);
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
                AddApiHeaders(req);
                req.AddJsonBody(visitDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                if (result.Data.IsSuccess)
                {
                    var data = await GetVisits(StudyId);
                    await _liveDataHub.Clients.Group("Visit").SendAsync("LiveData", new Dictionary<string, object> { { "data", data }, { "message", Name} });
                }
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
                if (result.Data.IsSuccess)
                {
                    var data = await GetVisits(StudyId);
                    await _liveDataHub.Clients.Group("Visit").SendAsync("LiveData", new Dictionary<string, object> { { "data", data }, { "message", Name } });
                }
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

        public async Task<RestResponse<List<PermissionModel>>> GetVisitPagePermissionList(PermissionPage pageKey, Int64 studyId, Int64 id)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitPagePermissionList", Method.Get);
                req.AddParameter("pageKey", pageKey);
                req.AddParameter("studyId", studyId);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync<List<PermissionModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetVisitPagePermission(VisitPagePermissionDTO dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisitPagePermission", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetStudyModule(SetModuleDTO dto)
        {
            //if (dto.ModuleIds.Count > 0 && dto.PageId != 0)
            //{
                using (var client = CoreServiceClient)
                {
                    string moduleIdsString = string.Join(",", dto.ModuleIds);
                    var req = new RestRequest("CoreStudy/GetModuleCollective", Method.Get);
                    req.AddParameter("moduleIds", moduleIdsString);
                    req.AddParameter("pageId", dto.PageId);
                    var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                    return result.Data;
                }
                //var modules = await GetModuleList(dto);

                //if (modules.IsSuccessful && modules.Data.Count > 0)
                //{
                //    return await SetStudyModule(modules.Data);
                //}
            //}

            //return new ApiResponse<dynamic>
            //{
            //    IsSuccess = false,
            //    Message = "Unsuccessful"
            //};
        }

        public async Task<RestResponse<List<VisitModel>>> GetTransferData(Int64 demoStudyId, Int64 activeStudyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetTransferData", Method.Get);
                req.AddParameter("demoStudyId", demoStudyId);
                req.AddParameter("activeStudyId", activeStudyId);
                var result = await client.ExecuteAsync<List<VisitModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetTransferData(List<TransferDataDTO> dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetTransferData", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<StudyVisitRelationModel>> GetVisitRelation()
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitRelation", Method.Get);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<StudyVisitRelationModel>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetVisitRelation(List<StudyVisitRelationDTO> dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisitRelation", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Module
        public async Task<RestResponse<List<ElementModel>>> GetStudyModuleElementsWithChildren(Int64 studyVisitPageModuleId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyModuleElementsWithChildren", Method.Get);
                req.AddParameter("studyModuleId", studyVisitPageModuleId);
                var result = await client.ExecuteAsync<List<ElementModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SaveVisitPageModuleContent(ElementModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SaveVisitPageModuleContent", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> CopyElement(Int64 id, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/CopyElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteElement(Int64 id, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<ApiResponse<dynamic>> CopyTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                RowIndex = rowIndex,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/CopyTableRowElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<ApiResponse<dynamic>> DeleteTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                RowIndex = rowIndex,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteTableRowElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<List<ElementModel>> GetVisitPageModuleAllElements(Int64 id)
        {
            var elements = new List<ElementModel>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitPageModuleAllElements", Method.Get);
                req.AddParameter("visitPageModuleId", id);
                var result = await client.ExecuteAsync(req);
                //elements = JsonSerializer.Deserialize<List<ElementModel>>(result.Content);
                elements = JsonConvert.DeserializeObject<List<ElementModel>>(result.Content);
            }

            return elements;
        }

        public async Task<ElementModel> GetVisitPageModuleElementData(Int64 id)
        {
            var element = new ElementModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitPageModuleElementData", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync(req);
                //element = JsonSerializer.Deserialize<ElementModel>(result.Content);
                element = JsonConvert.DeserializeObject<ElementModel>(result.Content);
            }

            return element;
        }

        public async Task<ModuleModel> GetStudyPageModule(Int64 id)
        {
            var module = new ModuleModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyPageModule", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync(req);
                //module = JsonSerializer.Deserialize<ModuleModel>(result.Content);
                module = JsonConvert.DeserializeObject<ModuleModel>(result.Content);
            }

            return module;
        }

        public async Task<ApiResponse<dynamic>> SetVisitRanking(List<VisitDTO> dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisitRanking", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                if (result.Data.IsSuccess)
                {
                    var data = await GetVisits(StudyId);
                    await _liveDataHub.Clients.Group("Visit").SendAsync("LiveData", new Dictionary<string, object> { { "data", data }, { "message", Name } });
                }
                return result.Data;
            }
        }

        public async Task<VisitCollectionModel> GetVisitCollectionInfo(Int64 elementId)
        {
            var module = new VisitCollectionModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitCollectionInfo", Method.Get);
                req.AddParameter("elementId", elementId);
                var result = await client.ExecuteAsync(req);
                //module = JsonSerializer.Deserialize<VisitCollectionModel>(result.Content);
                module = JsonConvert.DeserializeObject<VisitCollectionModel>(result.Content);
            }

            return module;
        }
        #endregion
    }
}
