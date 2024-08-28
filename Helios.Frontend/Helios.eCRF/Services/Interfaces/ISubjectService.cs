using Helios.Common.DTO;
using Helios.Common.Model;
using RestSharp;

namespace Helios.eCRF.Services.Interfaces
{
    public interface ISubjectService
    {
        Task<RestResponse<List<SubjectDTO>>> GetSubjectList(Int64 studyId, bool showArchivedSubjects);
        Task<ApiResponse<dynamic>> AddSubject(SubjectDTO subject);
        Task<RestResponse<List<SiteModel>>> GetSites(Int64 studyId);
        Task<UserPermissionModel> GetUserPermissions(Int64 studyId);
        Task<List<SubjectDetailMenuModel>> GetSubjectDetailMenu(Int64 studyId, Int64 subjectId);
        Task<RestResponse<List<SubjectElementModel>>> GetSubjectElementList(Int64 subjectId, Int64 subjectVisitModulePageId);
        Task<ApiResponse<dynamic>> AutoSaveSubjectData(SubjectElementShortModel model);
        Task<ApiResponse<dynamic>> AddDatagridSubjectElements(Int64 datagridId);
        Task<ApiResponse<dynamic>> RemoveDatagridSubjectElements(DatagridRemoveDTO dto);
        Task<bool> GetStudyAskSubjectInitial(Int64 studyId);
        Task<ApiResponse<dynamic>> DeleteOrArchiveSubject(SubjectArchiveOrDeleteModel model);
        Task<RestResponse<byte[]>> GetSubjectVisitAnnotatedCrf(Int64 subjectId);
        Task<RestResponse<List<SubjectCommentModel>>> GetSubjectComments(Int64 subjectElementId);
        Task<ApiResponse<dynamic>> RemoveSubjectComment(Int64 id);
        Task<ApiResponse<dynamic>> SetSubjectComment(SubjectCommentDTO dto);
        Task<ApiResponse<dynamic>> SetSubjectMissingData(SubjectMissingDataDTO dto);
        Task<ApiResponse<dynamic>> SetSubjectSdv(List<Int64> ids);
    }
}
