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
        /// <param name="showArchivedSubjects">arşivlenmiş hastaları göster</param>
        /// <returns>hasta listesi</returns>
        [HttpGet("{studyId}/{showArchivedSubjects}")]
        //[Authorize(Roles = "StudyUser")]
        public async Task<IActionResult> GetSubjectList(Int64 studyId, bool showArchivedSubjects)
        {
            var result = await _subjectService.GetSubjectList(studyId, showArchivedSubjects);
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
        public async Task<IActionResult> GetSubjectElementList(Int64 subjectId, Int64 subjectVisitModulePageId, int rowIndex)
        {
            var result = await _subjectService.GetSubjectElementList(subjectId, subjectVisitModulePageId, rowIndex);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// Hasta detay sayfasındaki sol menü verilerini listeler
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <param name="subjectId">hasta id</param>
        /// <returns>menü listesi</returns>
        [HttpGet("{studyId}/{subjectId}")]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectDetailMenu(Int64 studyId, Int64 subjectId)
        {
            var result = await _subjectService.GetSubjectDetailMenu(studyId, subjectId);
            return new ObjectResult(result);
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> AutoSaveSubjectData(SubjectElementShortModel model)
        {
            var result = await _subjectService.AutoSaveSubjectData(model);
            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> AddDatagridSubjectElements(Int64 datagridId)
        {
            var result = await _subjectService.AddDatagridSubjectElements(datagridId);
            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> RemoveDatagridSubjectElements(DatagridRemoveDTO dto)
        {
            var result = await _subjectService.RemoveDatagridSubjectElements(dto);
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

        /// <summary>
        /// hastanın verilerini pdf olarak gösterir
        /// </summary>
        /// <param name="subjectId">hasta id</param>
        /// <returns>pdf</returns>
        [HttpGet("{subjectId}")]
        public async Task<IActionResult> GetSubjectVisitAnnotatedCrf(Int64 subjectId)
        {
            var result = await _subjectService.GetSubjectVisitAnnotatedCrf(subjectId);
            return new ObjectResult(result.Data != null ? File(result.Data, "application/pdf") : null) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// hastanın formundaki elementin yorumlarını listeler
        /// </summary>
        /// <param name="subjectElementId">hasta element id</param>
        /// <returns>yorumlar</returns>
        [HttpGet("{subjectElementId}")]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectComments(Int64 subjectElementId)
        {
            var result = await _subjectService.GetSubjectComments(subjectElementId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// hastanın ilgili elementine bağlı relation verilerini çekiyor
        /// </summary>
        /// <param name="subjectVisitPageModuleElementId">hasta element id</param>
        /// <returns>yorumlar</returns>
        [HttpGet]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetRelationPageElementValues(Int64 subjectVisitPageModuleElementId,Int64 studyId, string? value, Int64 subjectId)
        {
            var result = await _subjectService.GetRelationPageElementValues(subjectVisitPageModuleElementId,studyId,value,subjectId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }
        /// <summary>
        /// hastanın elementindeki seçili yorumu siler
        /// </summary>
        /// <param name="id">yorum id</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> RemoveSubjectComment(Int64 id)
        {
            var result = await _subjectService.RemoveSubjectComment(id);
            return Ok(result);
        }

        /// <summary>
        /// hastanın elementine yorum ekler veya günceller
        /// </summary>
        /// <param name="dto">yorum bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> SetSubjectComment(SubjectCommentDTO dto)
        {
            var result = await _subjectService.SetSubjectComment(dto);
            return Ok(result);
        }

        /// <summary>
        /// Hasta sayfasında seçilen elementi unk olarak işaretler
        /// </summary>
        /// <param name="dto">parametreler</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> SetSubjectMissingData(SubjectMissingDataDTO dto)
        {
            var result = await _subjectService.SetSubjectMissingData(dto);
            return Ok(result);
        }

        /// <summary>
        /// Hasta sayfasında seçilen elementi sdv olarak işaretler
        /// </summary>
        /// <param name="ids">elementlerin idleri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> SetSubjectSdv(List<Int64> ids)
        {
            var result = await _subjectService.SetSubjectSdv(ids);
            return Ok(result);
        }

        /// <summary>
        /// Giriş yapan kullanıcının merkez bilgisine göre hastaların sdv durumlarını listeler
        /// </summary>
        /// <returns>sdv listesi</returns>
        [HttpGet]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectSdvList()
        {
            var result = await _subjectService.GetSubjectSdvList();
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// Hastanın multi form listesini çeker
        /// </summary>
        /// <param name="subjectId">hasta id</param>
        /// <param name="studyVisitId">vizit sayfa id</param>
        /// <param name="showArchivedMulties">arşivlenmişleri göstersin mi</param>
        /// <returns>hasta multi form listesi</returns>
        [HttpGet("{subjectId}/{studyVisitId}/{showArchivedMulties}")]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectMultiList(Int64 subjectId, Int64 studyVisitId, bool showArchivedMulties)
        {
            var result = await _subjectService.GetSubjectMultiList(subjectId, studyVisitId, showArchivedMulties);

            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// Hastaya yeni multi form eklenir
        /// </summary>
        /// <param name="subjectId">hasta id</param>
        /// <param name="studyVisitId">vizit sayfa id</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> AddSubjectMultiForm(Int64 subjectId, Int64 studyVisitId)
        {
            var result = await _subjectService.AddSubjectMultiForm(subjectId, studyVisitId);
            return Ok(result);
        }

        /// <summary>
        /// Hastaya multi form siler
        /// </summary>
        /// <param name="subjectId">hasta id</param>
        /// <param name="subjectVisitId">vizit sayfa id</param>
        /// <param name="rowIndex">vizit row index</param>
        /// <param name="isArchived">archive olacak mi?</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> DeleteOrArchiveSubjectMultiForm(Int64 subjectId, Int64 subjectVisitId, int rowIndex, bool isArchived, bool unArchive, string comment)
        {
            var model = new SubjectMultiFormArchiveOrDeleteModel
            {
                SubjectId = subjectId,
                SubjectVisitId = subjectVisitId,
                RowIndex = rowIndex,
                IsArchived = isArchived,
                Comment = comment
            };

            var result = await _subjectService.DeleteOrArchiveSubjectMultiForm(model, unArchive);
            return Ok(result);
        }

        /// <summary>
        /// hasta sayfasındaki elementin sorgu işlemini gerçekleştirir
        /// </summary>
        /// <param name="dto">sorgu bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> SetSubjectQuery(SubjectQueryDTO dto)
        {
            var result = await _subjectService.SetSubjectQuery(dto);
            return Ok(result);
        }

        /// <summary>
        /// hasta sayfasındaki elementin sorgularını listeler
        /// </summary>
        /// <param name="subjectElementId">element id</param>
        /// <returns>sorgu listesi</returns>
        [HttpGet("{subjectElementId}")]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectQueries(Int64 subjectElementId)
        {
            var result = await _subjectService.GetSubjectQueries(subjectElementId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// sorguları listeler
        /// </summary>
        /// <returns>sorgu listesi</returns>
        [HttpGet]
        [RoleAttribute(Roles.StudyUser)]
        public async Task<IActionResult> GetSubjectQueryList()
        {
            var result = await _subjectService.GetSubjectQueryList();
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }
    }
}
