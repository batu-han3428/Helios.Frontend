using Helios.Common.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace Helios.eCRF.Attributes
{
    public class RoleAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private Roles[] _roles;

        public RoleAttribute(params Roles[] roles)
        {
            _roles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            var userRoles = user.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
            if (!_roles.Any(role => userRoles.Contains(role.ToString())))
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}
