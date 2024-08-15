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
    public class StudyController : Controller
    {
        private IStudyService _studyService;

        public StudyController(IStudyService studyService)
        {
            _studyService = studyService;
        }

        #region Study


        /// <summary>
        /// çalışma listesini döner
        /// </summary>
        /// <returns>çalışmalar</returns>
        [HttpGet("{isLock}/{tenantId}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetStudyList(bool isLock, Int64 tenantId)
        {
            var result = await _studyService.GetStudyList(isLock, tenantId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// seçili çalışmanın bilgilerini döner
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>çalışma bilgileri</returns>
        [HttpGet("{studyId}")]
        [RoleAttribute(Roles.TenantAdmin, Roles.StudyUser)]
        public async Task<IActionResult> GetStudy(Int64 studyId)
        {
            var result = await _studyService.GetStudy(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// tenant çalışma limiti döner
        /// </summary>
        /// <returns>tenant bilgisi</returns>
        [HttpGet("{tenantId}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetTenantStudyLimit(Int64 tenantId)
        {
            var result = await _studyService.GetTenantStudyLimit(tenantId);
            if (result == null)
            {
                return Ok("0");
               
            }
            return Ok(result);
        }
        /// <summary>
        /// çalışma kaydeder
        /// </summary>
        /// <param name="studyModel">çalışma bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> StudySave(StudyModel studyModel)
        {
            var result = await _studyService.StudySave(studyModel);

            return Ok(result);
        }


        /// <summary>
        /// çalışmayı kitler ya da kilidini açar
        /// </summary>
        /// <param name="studyLockDTO">çalışma bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> StudyLockOrUnlock(StudyLockDTO studyLockDTO)
        {
            var result = await _studyService.StudyLockOrUnlock(studyLockDTO);

            return Ok(result);
        }
        #endregion

        #region Site


        /// <summary>
        /// çalışmadaki site listesini döner
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>site listesi</returns>
        [HttpGet("{studyId}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetSiteList(Int64 studyId)
        {
            var result = await _studyService.GetSiteList(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// seçili site ı döner
        /// </summary>
        /// <param name="siteId">site id</param>
        /// <returns>site bilgisi</returns>
        [HttpGet("{siteId}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetSite(Int64 siteId)
        {
            var result = await _studyService.GetSite(siteId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// yeni bir site kaydeder veya seçili site ı günceller
        /// </summary>
        /// <param name="siteModel">site bilgisi</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SiteSaveOrUpdate(SiteModel siteModel)
        {
            var result = await _studyService.SiteSaveOrUpdate(siteModel);

            return Ok(result);
        }


        /// <summary>
        /// seçili site ı siler
        /// </summary>
        /// <param name="siteModel">site bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SiteDelete(SiteModel siteModel)
        {
            var result = await _studyService.SiteDelete(siteModel);

            return Ok(result);
        }
        #endregion

        #region Mail Template

        /// <summary>
        /// Çalışmanın mail templatelerini listeler
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>mail templateler</returns>
        [HttpGet("{studyId}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetEmailTemplateList(Int64 studyId)
        {
            var result = await _studyService.GetEmailTemplateList(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// email template siler
        /// </summary>
        /// <param name="emailTemplateDTO">template bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> DeleteEmailTemplate(BaseDTO emailTemplateDTO)
        {
            var result = await _studyService.DeleteEmailTemplate(emailTemplateDTO);

            return Ok(result);
        }


        /// <summary>
        /// seçili mail template getirir
        /// </summary>
        /// <param name="templateId">template id</param>
        /// <returns>mail template</returns>
        [HttpGet("{templateId}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetEmailTemplate(Int64 templateId)
        {
            var result = await _studyService.GetEmailTemplate(templateId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// email template tagları listeler
        /// </summary>
        /// <param name="tenantId">tenant id</param>
        /// <param name="templateType">template type</param>
        /// <returns>tag listesi</returns>
        [HttpGet("{tenantId}/{templateType}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetEmailTemplateTagList(Int64 tenantId, int templateType)
        {
            var result = await _studyService.GetEmailTemplateTagList(tenantId, templateType);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// email template tag ekler
        /// </summary>
        /// <param name="emailTemplateTagDTO">tag bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> AddEmailTemplateTag(EmailTemplateTagDTO emailTemplateTagDTO)
        {
            var result = await _studyService.AddEmailTemplateTag(emailTemplateTagDTO);

            return Ok(result);
        }


        /// <summary>
        /// email template tag siler
        /// </summary>
        /// <param name="emailTemplateTagDTO">tag bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> DeleteEmailTemplateTag(EmailTemplateTagDTO emailTemplateTagDTO)
        {
            var result = await _studyService.DeleteEmailTemplateTag(emailTemplateTagDTO);

            return Ok(result);
        }


        /// <summary>
        /// email template ekler ya da günceller
        /// </summary>
        /// <param name="emailTemplateDTO">email template bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetEmailTemplate(EmailTemplateDTO emailTemplateDTO)
        {
            var result = await _studyService.SetEmailTemplate(emailTemplateDTO);

            return Ok(result);
        }
        #endregion

        #region Visit

        /// <summary>
        /// Çalışmanın vizitlerini döner
        /// </summary>
        /// <param name="studyId">çalışma id</param>
        /// <returns>vizit listesi</returns>
        [HttpGet("{studyId}")]
        //[Authorize(Roles = "TenantAdmin")]
        public async Task<IActionResult> GetVisits(Int64 studyId)
        {
            var result = await _studyService.GetVisits(studyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// Visit, page yada module ekler veya günceller
        /// </summary>
        /// <param name="visitDTO">eklenecek yada güncellenecek veri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetVisits(VisitDTO visitDTO)
        {
            var result = await _studyService.SetVisits(visitDTO);

            return Ok(result);
        }


        /// <summary>
        /// Visit, page yada module siler
        /// </summary>
        /// <param name="visitDTO">silinecek veri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> DeleteVisits(VisitDTO visitDTO)
        {
            var result = await _studyService.DeleteVisits(visitDTO);

            return Ok(result);
        }


        /// <summary>
        /// page in epro olup olmadığını ayarlar
        /// </summary>
        /// <param name="visitDTO">page</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetVisitPageEPro(VisitDTO visitDTO)
        {
            var result = await _studyService.SetVisitPageEPro(visitDTO);

            return Ok(result);
        }


        /// <summary>
        /// Admin panelinde visits sayfasındaki yetkileri listeler
        /// </summary>
        /// <returns>yetki listesi</returns>
        [HttpGet]
        [ResponseCache(Duration = 3600)]
        public IActionResult GetStudyVisitPermissionsList()
        {
            try
            {
                var permissions = Enum.GetValues(typeof(VisitPermission))
                              .Cast<VisitPermission>()
                              .Select(p => new { Name = p.ToString(), Key = (int)p })
                              .ToArray();
                return Ok(permissions);
            }
            catch (Exception)
            {
                return StatusCode(500, "Unsuccessful");
            }
        }


        /// <summary>
        /// Yetkileri listeler
        /// </summary>
        /// <param name="pageKey">yetki key</param>
        /// <param name="studyId">çalışma id</param>
        /// <param name="id">visit veya page id</param>
        /// <returns>yetki listesi</returns>
        [HttpGet("{pageKey}/{studyId}/{id}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetVisitPagePermissionList(PermissionPage pageKey, Int64 studyId, Int64 id)
        {
            var result = await _studyService.GetVisitPagePermissionList(pageKey, studyId, id);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// vizit ya da sayfa yetkilerini günceller
        /// </summary>
        /// <param name="dto">yetki bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetVisitPagePermission(VisitPagePermissionDTO dto)
        {
            var result = await _studyService.SetVisitPagePermission(dto);

            return Ok(result);
        }


        /// <summary>
        /// Seçili modul veya modulleri kaydeder
        /// </summary>
        /// <param name="dto">modül/lerin ve sayfa bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetStudyModule(SetModuleDTO dto)
        {
            var result = await _studyService.SetStudyModule(dto);

            return Ok(result);
        }


        /// <summary>
        /// vizit ranking ayarlarını kaydeder
        /// </summary>
        /// <param name="dto">visit bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetVisitRanking(List<VisitDTO> dto)
        {
            var result = await _studyService.SetVisitRanking(dto);

            return Ok(result);
        }


        /// <summary>
        /// active study ve demo study arasındaki farkları gösterir
        /// </summary>
        /// <param name="demoStudyId">demo çalışma id</param>
        /// <param name="activeStudyId">active çalışma id</param>
        /// <returns>visit listesi</returns>
        [HttpGet("{demoStudyId}/{activeStudyId}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetTransferData(Int64 demoStudyId, Int64 activeStudyId)
        {
            var result = await _studyService.GetTransferData(demoStudyId, activeStudyId);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }


        /// <summary>
        /// active study ile demo study arasındaki seçili farkları kaydeder
        /// </summary>
        /// <param name="dto">visit bilgileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetTransferData(List<TransferDataDTO> dto)
        {
            var result = await _studyService.SetTransferData(dto);

            return Ok(result);
        }

        /// <summary>
        /// visit relation sayfasındaki verileri listeler
        /// </summary>
        /// <returns>relation ve sayfa listesi</returns>
        [HttpGet]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetVisitRelation()
        {
            var result = await _studyService.GetVisitRelation();
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// visit relation verilerini kaydeder
        /// </summary>
        /// <param name="dto">relation verileri</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetVisitRelation(List<StudyVisitRelationDTO> dto)
        {
            var result = await _studyService.SetVisitRelation(dto);
            return Ok(result);
        }

        /// <summary>
        /// visitleri pdf dosyası olarak döner
        /// </summary>
        /// <param name="dto">pdf oluşturma seçenekleri</param>
        /// <returns>pdf dosyası</returns>
        [HttpGet]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetStudyVisitAnnotatedCrf([FromQuery] AnnotatedDTO dto)
        {
            var result = await _studyService.GetStudyVisitAnnotatedCrf(dto);
            return new ObjectResult(result.Data != null ? File(result.Data, "application/pdf") : null) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// daha önceden oluşturulmuş versiyonlu pdf listesini listeler
        /// </summary>
        /// <returns>versiyon pdf listesi</returns>
        [HttpGet]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetStudyVisitAnnotatedCrfHistory()
        {
            var result = await _studyService.GetStudyVisitAnnotatedCrfHistory();
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// seçili olan versiyon pdfi döner
        /// </summary>
        /// <param name="id">pdf id</param>
        /// <returns>pdf dosyası</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudyVisitAnnotatedCrfHistoryPdf(Int64 id)
        {
            var result = await _studyService.GetStudyVisitAnnotatedCrfHistoryPdf(id);
            return new ObjectResult(result.Data != null ? File(result.Data, "application/pdf") : null) { StatusCode = (int)result.StatusCode };
        }
        #endregion

        #region Module
        [HttpGet]
        //[Authorize(Roles = "TenantAdmin")]
        public async Task<IActionResult> GetStudyModuleElementsWithChildren(Int64 studyVisitPageModuleId)
        {
            var result = await _studyService.GetStudyModuleElementsWithChildren(studyVisitPageModuleId);

            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        [HttpPost]
        public ApiResponse<dynamic> SaveModuleContent(ElementModel model)
        {
            var result = new ApiResponse<dynamic>();

            if (model.IsDependent
                && (model.DependentSourceFieldId == null
                || model.DependentTargetFieldId == null
                || model.DependentCondition == 0
                || model.DependentAction == 0
                || model.DependentFieldValue == ""))
            {
                result.IsSuccess = false;
                result.Message = "Dependent Error";
            }
            else
            {
                result = _studyService.SaveVisitPageModuleContent(model).Result;
            }

            return result;
        }

        [HttpPost]
        //[Authorize(Roles = "TenantAdmin")]
        public async Task<ApiResponse<dynamic>> CopyElement(Int64 id, Int64 userId)
        {
            var result = await _studyService.CopyElement(id, userId);
            return result;
        }

        [HttpPost]
        //[Authorize(Roles = "TenantAdmin")]
        public async Task<ApiResponse<dynamic>> DeleteElement(Int64 id, Int64 userId)
        {
            var result = await _studyService.DeleteElement(id, userId);
            return result;
        }
        [HttpPost]
        public async Task<ApiResponse<dynamic>> CopyTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var result = await _studyService.CopyTableRowElement(id, rowIndex, userId);
            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> DeleteTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var result = await _studyService.DeleteTableRowElement(id, rowIndex, userId);
            return result;
        }


        [HttpGet]
        public async Task<List<ElementModel>> GetModuleAllElements(Int64 id)
        {
            var result = await _studyService.GetVisitPageModuleAllElements(id);

            return result;
        }

        [HttpGet]
        public async Task<ElementModel> GetElementData(string id)
        {
            var elementId = Int64.Parse(id);
            var result = await _studyService.GetVisitPageModuleElementData(elementId);

            return result;
        }

        [HttpGet]
        public async Task<ModuleModel> GetStudyPageModule(Int64 id)
        {
            var result = await _studyService.GetStudyPageModule(id);

            return result;
        }

        [HttpGet]
        public async Task<VisitCollectionModel> GetVisitCollectionInfo(Int64 elementId)
        {
            var result = await _studyService.GetVisitCollectionInfo(elementId);

            return result;
        }

        [HttpGet]
        public async Task<List<Int64>> GetDependentHideElement(string targetElementIds, string? pValue)
        {
            var result = await _studyService.GetDependentHideElement(targetElementIds, pValue);
            return result;
        }
        #endregion
    }
}
