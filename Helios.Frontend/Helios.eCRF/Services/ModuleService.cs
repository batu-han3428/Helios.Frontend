using Helios.Common.DTO;
using Helios.Common.Model;
using Helios.eCRF.Models;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using Newtonsoft.Json;
using RestSharp;

namespace Helios.eCRF.Services
{
    public class ModuleService : ApiBaseService, IModuleService
    {
        public ModuleService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        public async Task<bool> AddModule(ModuleModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/AddModule", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync(req);
                return result.IsSuccessful;
            }
        }

        public async Task<bool> UpdateModule(ModuleModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/UpdateModule", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync(req);
                return result.IsSuccessful;
            }
        }

        public async Task<bool> DeleteModule(ModuleModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/DeleteModule", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync(req);
                return result.IsSuccessful;
            }
        }

        public async Task<ModuleModel> GetModule(Int64 id)
        {
            var module = new ModuleModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetModule", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync(req);
                module = JsonConvert.DeserializeObject<ModuleModel>(result.Content);
            }

            return module;
        }

        public async Task<List<ModuleModel>> GetModuleList(Int64 tenantId)
        {
            var moduleList = new List<ModuleModel>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetModuleList", Method.Get);
                req.AddParameter("tenantId", tenantId);
                var result = await client.ExecuteAsync(req);
                moduleList = JsonConvert.DeserializeObject<List<ModuleModel>>(result.Content);
            }

            return moduleList;
        }

        public async Task<List<ElementModel>> GetModuleAllElements(Int64 id)
        {
            var elements = new List<ElementModel>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetModuleAllElements", Method.Get);
                req.AddParameter("moduleId", id);
                var result = await client.ExecuteAsync(req);
                elements = JsonConvert.DeserializeObject<List<ElementModel>>(result.Content);
            }

            return elements;
        }

        public async Task<List<ElementModel>> GetModuleElementsWithChildren(Int64 id)
        {
            var elements = new List<ElementModel>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetModuleElementsWithChildren", Method.Get);
                req.AddParameter("moduleId", id);
                var result = await client.ExecuteAsync(req);
                elements = JsonConvert.DeserializeObject<List<ElementModel>>(result.Content);
            }

            return elements;
        }

        public async Task<ElementModel> GetElementData(Int64 id)
        {
            var element = new ElementModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetElementData", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync(req);
                element = JsonConvert.DeserializeObject<ElementModel>(result.Content);
            }

            return element;
        }

        public async Task<ApiResponse<dynamic>> SaveModuleContent(ElementModel model)
        {
            var response = new ApiResponse<dynamic>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/SaveModuleContent", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> CopyElement(Int64 id, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                UserId = userId,
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/CopyElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteElement(Int64 id, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                UserId = userId,
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/DeleteElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<List<TagModel>> GetMultipleTagList(Int64 id)
        {
            var tagList = new List<TagModel>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetMultipleTagList", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync(req);
                tagList = JsonConvert.DeserializeObject<List<TagModel>>(result.Content);
            }

            return tagList;
        }

        public async Task<ApiResponse<dynamic>> AddNewTag(List<TagModel> tags)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/AddNewTag", Method.Post);
                req.AddJsonBody(tags);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
    }
}
