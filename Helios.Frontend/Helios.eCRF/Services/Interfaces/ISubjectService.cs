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
        Task<bool> GetStudyAskSubjectInitial(Int64 studyId);
        Task<ApiResponse<dynamic>> DeleteOrArchiveSubject(SubjectArchiveOrDeleteModel model);
        Task<RestResponse<byte[]>> GetSubjectVisitAnnotatedCrf(Int64 subjectId);
    }
}
