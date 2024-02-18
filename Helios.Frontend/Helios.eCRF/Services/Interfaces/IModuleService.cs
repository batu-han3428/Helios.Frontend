using Helios.eCRF.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Helios.Common.DTO;
using Helios.Common.Model;

namespace Helios.eCRF.Services.Interfaces
{
    public interface IModuleService
    {
        Task<bool> AddModule(ModuleModel model);
        Task<bool> UpdateModule(ModuleModel model);
        Task<bool> DeleteModule(ModuleModel model);
        Task<ModuleModel> GetModule(Int64 id);
        Task<List<ModuleModel>> GetModuleList(Int64 tenantId);
        Task<List<ElementModel>> GetModuleAllElements(Int64 id);
        Task<List<ElementModel>> GetModuleElementsWithChildren(Int64 id);
        Task<ElementModel> GetElementData(Int64 id);
        Task<ApiResponse<dynamic>> SaveModuleContent(ElementModel model);
        Task<ApiResponse<dynamic>> CopyElement(Int64 id, Int64 userId);
        Task<ApiResponse<dynamic>> DeleteElement(Int64 id, Int64 userId);
        Task<List<TagModel>> GetMultipleTagList(Int64 id);
        Task<ApiResponse<dynamic>> AddNewTag(List<TagModel> tags);
    }
}
