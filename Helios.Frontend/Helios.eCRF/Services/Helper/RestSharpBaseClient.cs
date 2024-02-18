using RestSharp;
using System.Text.Json;

namespace Helios.eCRF.Services.Helper
{
    public class RestSharpBaseClient : RestClient
    {
        public RestSharpBaseClient(string serviceHost) : base(new RestClientOptions(new Uri(serviceHost)))
        {

        }
        public async Task<T> ExecuteAsync<T>(RestRequest request)
        {

            var response = await base.ExecuteAsync(request);
            //TimeoutCheck(request, response);
            if (!response.IsSuccessful)
                throw new Exception(response.ErrorMessage);

            var data = JsonSerializer.Deserialize<T>(response.Content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return data;
        }
    }
}
