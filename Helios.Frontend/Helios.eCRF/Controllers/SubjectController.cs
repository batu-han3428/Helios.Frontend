using Helios.Common.DTO;
using Helios.Common.Model;
using Microsoft.AspNetCore.Mvc;

namespace Helios.eCRF.Controllers
{
    public class SubjectController : ControllerBase
    {
        [HttpPost]
        public async Task<ApiResponse<dynamic>> AutoSaveSubjectData(ModuleModel model)
        {
            var result = new ApiResponse<dynamic>();
            return result;
        }
    }
}
