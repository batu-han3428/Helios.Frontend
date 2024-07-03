using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;
using Helios.eCRF.Attributes;
using Helios.eCRF.Services;
using Helios.eCRF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Helios.eCRF.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class SubjectController : Controller
    {
        private ISubjectService _subjectService;
        private IUserService _userService;
        public SubjectController(ISubjectService subjectService, IUserService userService)
        {
            _subjectService = subjectService;
            _userService = userService;
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
            var addedbyids = result.Data.SubjectList.Select(x => x.AddedById).Distinct().ToList();           
            var users = await _userService.GetUserList(addedbyids);           
            foreach (var user in result.Data.SubjectList) {
                var addedby= users.Data.FirstOrDefault(x => x.Id == user.AddedById);
                user.AddedByName = addedby.Name + ' ' + addedby.LastName;
            }
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// Hasta eklenir
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        public async Task<ApiResponse<dynamic>> AddSubject(SubjectDTO subject)
        {
            var result = await _subjectService.AddSubject(subject);
            return result;
        }
        /// <summary>
        /// Hasta eklenir
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>başarılı başarısız</returns>
        [HttpGet]
        public async Task<IActionResult> GetSites(Int64 studyId)
        {
            var result = await _subjectService.GetSites(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
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
            var result = await _subjectService.GetSubjectDetailMenu(studyId);
            return new ObjectResult(result);
        }


        [HttpPost]
        public async Task<ApiResponse<dynamic>> AutoSaveSubjectData(SubjectElementShortModel model)
        {
            var result = await _subjectService.AutoSaveSubjectData(model);
            return result;
        }

        [HttpGet]     
        public async Task<bool> GetStudyAskSubjectInitial(Int64 studyId)
        {
            var result = await _subjectService.GetStudyAskSubjectInitial(studyId);
            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> DeleteOrArchiveSubject(SubjectArchiveOrDeleteModel model)
        {
            var result = await _subjectService.DeleteOrArchiveSubject(model);
            return result;
        }
    }
}
