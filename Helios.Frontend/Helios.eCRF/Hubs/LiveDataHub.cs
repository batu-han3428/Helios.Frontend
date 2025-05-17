using Microsoft.AspNetCore.SignalR;

namespace Helios.eCRF.Hubs
{
    public class LiveDataHub: Hub
    {
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LiveData(string groupName, string data)
        {
            await Clients.Group(groupName).SendAsync("LiveData", data);
        }
    }
}
