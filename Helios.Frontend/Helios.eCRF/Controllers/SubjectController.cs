using Helios.Common.DTO;
using Helios.Common.Model;
using Helios.eCRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Helios.eCRF.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class SubjectController : Controller
    {
        private ISubjectService _subjectService;
        public SubjectController(ISubjectService subjectService)
        {
            _subjectService = subjectService;
        }

        [HttpGet("{studyId}")]
        //[Authorize(Roles = "TenantAdmin")]
        public async Task<IActionResult> GetSubjectList(Int64 studyId)
        {
            var result = await _subjectService.GetSubjectList(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> AddSubject(Int64 studyId)
        {
            var result = await _subjectService.AddSubject(studyId);
            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> AutoSaveSubjectData(ModuleModel model)
        {
            var result = new ApiResponse<dynamic>();
            return result;
        }
    }
}
