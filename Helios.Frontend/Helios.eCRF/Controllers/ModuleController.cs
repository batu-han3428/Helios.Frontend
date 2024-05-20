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
    public class ModuleController : ControllerBase
    {
        private IModuleService _moduleService;

        public ModuleController(IModuleService moduleService)
        {
            _moduleService = moduleService;
        }

        /// <summary>
        /// modül ekler
        /// </summary>
        /// <param name="name">modül adı</param>
        /// <returns>başarılı başarısız döner</returns>
        [HttpPost]
        public async Task<bool> SaveModule(ModuleModel model)
        {
            var result = false;

            if (model.Id != 0)
            {
                result = await _moduleService.UpdateModule(model);
            }
            else
            {
                result = await _moduleService.AddModule(model);
            }

            return result;
        }

        [HttpPost]
        public async Task<bool> AddModule(string name)
        {
            var model = new ModuleModel { Name = name };
            var result = await _moduleService.AddModule(model);
            return result;
        }


        /// <summary>
        /// modül günceller
        /// </summary>
        /// <param name="model">modül bilgileri</param>
        /// <returns>başarılı başarısız döner</returns>
        [HttpPost]
        public async Task<bool> UpdateModule(ModuleModel model)
        {
            var result = await _moduleService.UpdateModule(model);
            return result;
        }


        /// <summary>
        /// modül siler
        /// </summary>
        /// <param name="model">modül bilgileri</param>
        /// <returns>başarılı başarısız döner</returns>
        [HttpPost]
        public async Task<ApiResponse<dynamic>> DeleteModule(ModuleModel model)
        {
            var result = await _moduleService.DeleteModule(model);
            return result;
        }


        /// <summary>
        /// seçili modülün bilgilerini getirir
        /// </summary>
        /// <param name="id">modül id</param>
        /// <returns>istenen modülün bilgilerini döner</returns>
        [HttpGet]
        public async Task<ModuleModel> GetModule(Int64 id)
        {
            var result = await _moduleService.GetModule(id);

            return result;
        }


        /// <summary>
        /// modülleri döner
        /// </summary>
        /// <returns>modüller</returns>
        [HttpGet]
        public async Task<IActionResult> GetModuleList()
        {
            var result = await _moduleService.GetModuleList();
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        [HttpGet]
        public async Task<List<ElementModel>> GetModuleAllElements(Int64 id)
        {
            var result = await _moduleService.GetModuleAllElements(id);

            return result;
        }

        [HttpGet]
        public async Task<List<ElementModel>> GetModuleElementsWithChildren(Int64 id)
        {
            var result = await _moduleService.GetModuleElementsWithChildren(id);

            return result;
        }

        [HttpGet]
        public async Task<ElementModel> GetElementData(string id)
        {
            var elementId = Int64.Parse(id);
            var result = await _moduleService.GetElementData(elementId);

            return result;
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
                result = _moduleService.SaveModuleContent(model).Result;
            }

            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> CopyElement(Int64 id, Int64 userId)
        {
            var result = await _moduleService.CopyElement(id, userId);
            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> DeleteElement(Int64 id, Int64 userId)
        {
            var result = await _moduleService.DeleteElement(id, userId);
            return result;
        }
        [HttpPost]
        public async Task<ApiResponse<dynamic>> CopyTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var result = await _moduleService.CopyTableRowElement(id,rowIndex, userId);
            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> DeleteTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var result = await _moduleService.DeleteTableRowElement(id,rowIndex, userId);
            return result;
        }

        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<ApiResponse<dynamic>> RemoveMultipleTagList(Int64 id)
        {
            var result = await _moduleService.RemoveMultipleTagList(id);
            return result;
        }

        [HttpGet]
        public async Task<List<IGrouping<string, TagModel>>> GetMultipleTagList(Int64 id)
        {
            var result = _moduleService.GetMultipleTagList(id).Result.GroupBy(x => x.TagKey).ToList();

            return result;
        }

        [HttpPost]
        public async Task<ApiResponse<dynamic>> AddNewTag(List<TagModel> tags)
        {
            var result = await _moduleService.AddNewTag(tags);
            return result;
        }
        [HttpPost]
        public async Task<ApiResponse<dynamic>> AutoSaveElement(Int64 id, string value)
        {
            var result = await _moduleService.AutoSaveElement(id, value);
            return result;
        }

        /// <summary>
        /// Sıralama işlemi için seçili modülün elementlerini listeler
        /// </summary>
        /// <param name="moduleId">Modül Id</param>
        /// <param name="isStudy">çalışma modülü mü</param>
        /// <returns>Element listesi</returns>
        [HttpGet("{moduleId}/{isStudy}")]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> GetElementRankingList(Int64 moduleId, bool isStudy)
        {
            var result = await _moduleService.GetElementRankingList(moduleId, isStudy);
            return new ObjectResult(result.Data) { StatusCode = (int)result.StatusCode };
        }

        /// <summary>
        /// Modülün elementlerinin sıralama işlemini gerçekleştirir
        /// </summary>
        /// <param name="elements">modüldeki elementler</param>
        /// <param name="moduleId">modül id</param>
        /// <param name="isStudy">çalışma modülü mü</param>
        /// <returns>başarılı başarısız</returns>
        [HttpPost]
        [RoleAttribute(Roles.TenantAdmin)]
        public async Task<IActionResult> SetElementRankingList(List<ElementRankingModel> elements, Int64 moduleId, bool isStudy)
        {
            var result = await _moduleService.SetElementRankingList(elements, moduleId, isStudy);
            return Ok(result);
        }
    }
}
