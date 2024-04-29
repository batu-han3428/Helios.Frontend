using Helios.eCRF.Models;
using Helios.Common.DTO;
using Helios.Common.Model;
using RestSharp;

namespace Helios.eCRF.Services.Interfaces
{
    public interface ISubjectService
    {
        Task<RestResponse<List<SubjectDTO>>> GetSubjectList(Int64 studyId);
        Task<ApiResponse<dynamic>> AddSubject(Int64 studyId);
    }
}
