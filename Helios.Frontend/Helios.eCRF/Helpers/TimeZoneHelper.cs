using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace Helios.eCRF.Helpers
{
    public class TimeZoneHelper : IActionFilter
    {
        public TimeZoneHelper(){}

        public void OnActionExecuted(ActionExecutedContext context)
        {
            var authorizationHeader = context.HttpContext.Request.Headers["Authorization"];

            if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.ToString().StartsWith("Bearer "))
            {
                var token = authorizationHeader.ToString().Substring("Bearer ".Length);

                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

                var rolesClaim = jsonToken?.Claims.FirstOrDefault(claim => claim.Type == "roles")?.Value;

                if (!string.IsNullOrEmpty(rolesClaim) && (rolesClaim.Split(',').Contains("StudyUser") || rolesClaim.Split(',').Contains("TenantAdmin")))
                {
                    var timeZoneClaim = jsonToken?.Claims.FirstOrDefault(claim => claim.Type == "timeZone")?.Value;

                    if (!string.IsNullOrEmpty(timeZoneClaim))
                    {
                        if (context.Result is OkObjectResult result1)
                        {
                            ModifyDatesInRequest(result1.Value, timeZoneClaim);
                        }
                    }
                }
            }
        }
        private void ModifyDatesInRequest(object request, string timeZone)
        {
            if (request != null)
            {
                Type requestType = request.GetType();

                if (requestType.IsGenericType && requestType.GetGenericTypeDefinition() == typeof(List<>))
                {
                    IEnumerable<object> list = (IEnumerable<object>)request;

                    foreach (var item in list)
                    {
                        Type itemType = item.GetType();

                        foreach (var property in itemType.GetProperties())
                        {
                            if (property.PropertyType == typeof(DateTime) || property.PropertyType == typeof(DateTimeOffset))
                            {
                                var originalValue = property.GetValue(item);

                                if (originalValue != null)
                                {
                                    DateTime convertedDate;

                                    if (originalValue is DateTime)
                                    {
                                        var originalDate = (DateTime)originalValue;
                                        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
                                        convertedDate = TimeZoneInfo.ConvertTime(originalDate, timeZoneInfo);
                                        property.SetValue(item, convertedDate);
                                    }
                                    else if (originalValue is DateTimeOffset)
                                    {
                                        var originalOffset = (DateTimeOffset)originalValue;
                                        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
                                        convertedDate = TimeZoneInfo.ConvertTime(originalOffset, timeZoneInfo).DateTime;
                                        DateTimeOffset convertedDateTimeOffset = new DateTimeOffset(convertedDate, timeZoneInfo.GetUtcOffset(convertedDate));
                                        property.SetValue(item, convertedDateTimeOffset);
                                    }
                                    else
                                    {
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        public void OnActionExecuting(ActionExecutingContext context) { }
    }
}
