using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;
using Helios.eCRF.Attributes;
using Helios.eCRF.Services.Interfaces;
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
        //[Authorize(Roles = "StudyUser")]
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

        [HttpGet]
        //[Authorize(Roles = "StudyUser")]
        public async Task<IActionResult> GetSubjectElementList(Int64 subjectId, Int64 subjectVisitModulePageId)
        {
            var result = await _subjectService.GetSubjectElementList(subjectId,subjectVisitModulePageId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> AutoSaveSubjectData(ModuleModel model)
        {
            var result = new ApiResponse<dynamic>();
            return result;
        }

        /// <summary>
        /// Hasta detay sayfasındaki sol menü verilerini listeler
        /// </summary>
        /// <param name="subjectId">hasta id</param>
        /// <returns>menü listesi</returns>
        [HttpGet("{subjectId}")]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectDetailMenu(Int64 subjectId)
        {
            var result = await _subjectService.GetSubjectDetailMenu(subjectId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }
    }
}
