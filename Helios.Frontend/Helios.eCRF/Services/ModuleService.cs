using Helios.Common.DTO;
using Helios.Common.Model;
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

        public async Task<ApiResponse<dynamic>> DeleteModule(ModuleModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/DeleteModule", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
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
                //module = JsonSerializer.Deserialize<ModuleModel>(result.Content);
                module = JsonConvert.DeserializeObject<ModuleModel>(result.Content);
            }

            return module;
        }

        public async Task<RestResponse<List<ModuleModel>>> GetModuleList()
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetModuleList", Method.Get);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<List<ModuleModel>>(req);

                var addedUserIds = result.Data.Select(x => x.AddedById);
                var updatedUserIds = result.Data.Select(x => x.UpdatedById).ToList();
                List<Int64?> ids = new List<Int64?>();
                foreach (var id in addedUserIds)
                {
                    if (!ids.Any(x => x == id))
                    {
                        ids.Add(id);
                    }
                }
                foreach (var id in updatedUserIds)
                {
                    if (!ids.Any(x => x == id))
                    {
                        ids.Add(id);
                    }
                }
                var getUserList = GetUserList(ids);

                foreach (var user in result.Data)
                {
                    var getaddeduser = getUserList.Result.Data.FirstOrDefault(x => x.Id == user.AddedById);
                    if (getaddeduser != null)
                    {
                        user.AddedNameAndLastName = getaddeduser.Name + " " + getaddeduser.LastName;
                    }
                    var getupdateduser = getUserList.Result.Data.FirstOrDefault(x => x.Id == user.UpdatedById);
                    if (getupdateduser != null)
                    {
                        user.UpdatedNameAndLastName = getupdateduser.Name + " " + getupdateduser.LastName;
                    }
                }

                return result;
            }
        }
        public async Task<RestResponse<List<AspNetUserDTO>>> GetUserList(List<Int64?> AuthUserIds)
        {
            using (var client = AuthServiceClient)
            {
                string authUserIdsString = string.Join(",", AuthUserIds);
                var req = new RestRequest("AdminUser/GetUserList", Method.Get);
                req.AddParameter("AuthUserIds", authUserIdsString);
                var users = await client.ExecuteAsync<List<AspNetUserDTO>>(req);
                return users;
            }
        }
        public async Task<List<ElementModel>> GetModuleAllElements(Int64 id)
        {
            var elements = new List<ElementModel>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetModuleAllElements", Method.Get);
                req.AddParameter("moduleId", id);
                var result = await client.ExecuteAsync(req);
                //elements = System.Text.Json.JsonSerializer.Deserialize<List<ElementModel>>(result.Content);
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
                //elements = JsonSerializer.Deserialize<List<ElementModel>>(result.Content);
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
                //element = JsonSerializer.Deserialize<ElementModel>(result.Content);
                element = JsonConvert.DeserializeObject<ElementModel>(result.Content);
            }

            return element;
        }

        public async Task<ApiResponse<dynamic>> SaveModuleContent(ElementModel model)
        {
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
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/CopyElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<ApiResponse<dynamic>> CopyTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                RowIndex=rowIndex,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/CopyTableRowElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<ApiResponse<dynamic>> DeleteTableRowElement(Int64 id,int rowIndex, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                RowIndex = rowIndex,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/DeleteTableRowElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> RemoveMultipleTagList(Int64 id)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/RemoveMultipleTagList", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(new
                {
                    id = id
                });
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
                Value = ""
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
                //tagList = JsonSerializer.Deserialize<List<TagModel>>(result.Content);
                tagList = JsonConvert.DeserializeObject<List<TagModel>>(result.Content);
            }

            return tagList;
        }

        public async Task<ApiResponse<dynamic>> AddNewTag(List<TagModel> tags)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/AddNewTag", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(tags);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<ApiResponse<dynamic>> AutoSaveElement(Int64 id, string value)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                UserId = 0,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/AutoSaveElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<List<ElementRankingModel>>> GetElementRankingList(Int64 moduleId, bool isStudy)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreModule/GetElementRankingList", Method.Get);
                req.AddParameter("moduleId", moduleId);
                req.AddParameter("isStudy", isStudy);
                var result = await client.ExecuteAsync<List<ElementRankingModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetElementRankingList(List<ElementRankingModel> elements, Int64 moduleId, bool isStudy)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest($"CoreModule/SetElementRankingList?moduleId={moduleId}&isStudy={isStudy}", Method.Post);
                req.AddJsonBody(elements);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
    }
}
