using Helios.Common.DTO;
using Helios.Common.Model;
using RestSharp;

namespace Helios.eCRF.Services.Interfaces
{
    public interface IModuleService
    {
        Task<bool> AddModule(ModuleModel model);
        Task<bool> UpdateModule(ModuleModel model);
        Task<ApiResponse<dynamic>> DeleteModule(ModuleModel model);
        Task<ModuleModel> GetModule(Int64 id);
        Task<RestResponse<List<ModuleModel>>> GetModuleList();
        Task<List<ElementModel>> GetModuleAllElements(Int64 id);
        Task<List<ElementModel>> GetModuleElementsWithChildren(Int64 id);
        Task<ElementModel> GetElementData(Int64 id);
        Task<ApiResponse<dynamic>> SaveModuleContent(ElementModel model);
        Task<ApiResponse<dynamic>> CopyElement(Int64 id, Int64 userId);
        Task<ApiResponse<dynamic>> RemoveMultipleTagList(Int64 id);
        Task<ApiResponse<dynamic>> DeleteElement(Int64 id, Int64 userId);
        Task<ApiResponse<dynamic>> DeleteTableRowElement(Int64 id, int rowIndex, Int64 userId);
        Task<ApiResponse<dynamic>> CopyTableRowElement(Int64 id, int rowIndex, Int64 userId);
        Task<List<TagModel>> GetMultipleTagList(Int64 id);
        Task<ApiResponse<dynamic>> AddNewTag(List<TagModel> tags);
        Task<ApiResponse<dynamic>> AutoSaveElement(Int64 id, string value);
        Task<RestResponse<List<ElementRankingModel>>> GetElementRankingList(Int64 moduleId, bool isStudy);
        Task<ApiResponse<dynamic>> SetElementRankingList(List<ElementRankingModel> elements, Int64 moduleId, bool isStudy);
    }
}
