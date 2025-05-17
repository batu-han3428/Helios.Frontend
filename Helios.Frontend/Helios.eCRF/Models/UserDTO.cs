namespace Helios.eCRF.Models
{
    public class UserDTO
    {
        public Int64 Id { get; set; }
        public List<Int64> TenantIds { get; set; }
        public List<Int64> StudyIds { get; set; }
        public List<string> Roles { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
