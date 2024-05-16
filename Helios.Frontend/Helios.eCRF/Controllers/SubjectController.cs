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
        ICacheService _cacheService;
        public SubjectController(ISubjectService subjectService, ICacheService cacheService)
        {
            _subjectService = subjectService;
            _cacheService = cacheService;
        }

        /// <summary>
        /// Hasta listesi verilerini listeler
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>hasta listesi</returns>
        [HttpGet("{studyId}")]
        //[Authorize(Roles = "StudyUser")]
        public async Task<IActionResult> GetSubjectList(Int64 studyId)
        {
            var result = await _subjectService.GetSubjectList(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// Hasta eklenir
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<ApiResponse<dynamic>> AddSubject(Int64 studyId)
        {
            var result = await _subjectService.AddSubject(studyId);
            return result;
        }

        /// <summary>
        /// Hasta eklenir
        /// </summary>
        /// <param name="subjectId">hasta id</param>
        /// <param name="subjectVisitModulePageId">hasta vizit modul sayfa id</param>
        /// <returns>hasta element listesi</returns>
        [HttpGet]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectElementList(Int64 subjectId, Int64 subjectVisitModulePageId)
        {
            var result = await _subjectService.GetSubjectElementList(subjectId,subjectVisitModulePageId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// Hasta detay sayfasındaki sol menü verilerini listeler
        /// </summary>
        /// <param name="subjectId">hasta id</param>
        /// <returns>menü listesi</returns>
        [HttpGet("{studyId}")]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectDetailMenu(Int64 studyId)
        {
            var result = await _cacheService.GetSubjectDetailMenu(studyId);
            return new ObjectResult(result);
        }


        [HttpPost]
        public async Task<ApiResponse<dynamic>> AutoSaveSubjectData(SubjectElementShortModel model)
        {
            var result = await _subjectService.AutoSaveSubjectData(model);
            return result;
        }
    }
}
