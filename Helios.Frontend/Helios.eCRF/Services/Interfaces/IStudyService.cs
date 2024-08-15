using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;
using RestSharp;

namespace Helios.eCRF.Services.Interfaces
{
    public interface IStudyService
    {
        Task<RestResponse<List<StudyDTO>>> GetStudyList(bool isLock, Int64 tenantId);
        Task<RestResponse<List<SiteDTO>>> GetSiteList(Int64 studyId);
        Task<ApiResponse<dynamic>> SiteSaveOrUpdate(SiteModel siteModel);
        Task<ApiResponse<dynamic>> SiteDelete(SiteModel siteModel);
        Task<RestResponse<SiteDTO>> GetSite(Int64 siteId);
        Task<RestResponse<StudyDTO>> GetStudy(Int64 studyId);
        Task<ApiResponse<dynamic>> StudySave(StudyModel studyModel);
        Task<string?> GetTenantStudyLimit(Int64 tenantId);
        Task<ApiResponse<dynamic>> StudyLockOrUnlock(StudyLockDTO studyLockDTO);
        Task<RestResponse<List<EmailTemplateModel>>> GetEmailTemplateList(Int64 studyId);
        Task<ApiResponse<dynamic>> DeleteEmailTemplate(BaseDTO emailTemplateDTO);
        Task<RestResponse<EmailTemplateModel>> GetEmailTemplate(Int64 templateId);
        Task<RestResponse<List<EmailTemplateTagModel>>> GetEmailTemplateTagList(Int64 tenantId, int templateType);
        Task<ApiResponse<dynamic>> AddEmailTemplateTag(EmailTemplateTagDTO emailTemplateTagDTO);
        Task<ApiResponse<dynamic>> DeleteEmailTemplateTag(EmailTemplateTagDTO emailTemplateTagDTO);
        Task<ApiResponse<dynamic>> SetEmailTemplate(EmailTemplateDTO emailTemplateDTO);
        Task<RestResponse<List<VisitModel>>> GetVisits(Int64 studyId);
        Task<ApiResponse<dynamic>> SetVisits(VisitDTO visitDTO);
        Task<ApiResponse<dynamic>> DeleteVisits(VisitDTO visitDTO);
        Task<ApiResponse<dynamic>> SetVisitPageEPro(VisitDTO visitDTO);
        Task<RestResponse<List<PermissionModel>>> GetVisitPagePermissionList(PermissionPage pageKey, Int64 studyId, Int64 id);
        Task<ApiResponse<dynamic>> SetVisitPagePermission(VisitPagePermissionDTO dto);
        Task<ApiResponse<dynamic>> SetStudyModule(SetModuleDTO dto);
        Task<RestResponse<List<VisitModel>>> GetTransferData(Int64 demoStudyId, Int64 activeStudyId);
        Task<ApiResponse<dynamic>> SetTransferData(List<TransferDataDTO> dto);
        Task<ApiResponse<dynamic>> SetVisitRanking(List<VisitDTO> dto);
        Task<RestResponse<List<ElementModel>>> GetStudyModuleElementsWithChildren(Int64 studyVisitPageModuleId);
        Task<ApiResponse<dynamic>> SaveVisitPageModuleContent(ElementModel model);
        Task<ApiResponse<dynamic>> CopyElement(Int64 id, Int64 userId);
        Task<ApiResponse<dynamic>> DeleteElement(Int64 id, Int64 userId);
        Task<ApiResponse<dynamic>> DeleteTableRowElement(Int64 id, int rowIndex, Int64 userId);
        Task<ApiResponse<dynamic>> CopyTableRowElement(Int64 id, int rowIndex, Int64 userId);
        Task<List<ElementModel>> GetVisitPageModuleAllElements(Int64 id);
        Task<ElementModel> GetVisitPageModuleElementData(Int64 id);
        Task<ModuleModel> GetStudyPageModule(Int64 id);
        Task<VisitCollectionModel> GetVisitCollectionInfo(Int64 elementId);
        Task<RestResponse<StudyVisitRelationModel>> GetVisitRelation();
        Task<ApiResponse<dynamic>> SetVisitRelation(List<StudyVisitRelationDTO> dto);
        Task<RestResponse<byte[]>> GetStudyVisitAnnotatedCrf(AnnotatedDTO dto);
        Task<ApiResponse<dynamic>> AddStudyVisitAnnotatedCrfVersion(AnnotatedVersionDTO dto);
        Task<RestResponse<List<AnnotatedCrfHistoryModel>>> GetStudyVisitAnnotatedCrfHistory();
        Task<RestResponse<byte[]>> GetStudyVisitAnnotatedCrfHistoryPdf(Int64 id);
        Task<List<Int64>> GetDependentHideElement(string targetElementIds, string? pValue);
    }
}
