using System.ComponentModel.DataAnnotations.Schema;

namespace Helios.eCRF.Models
{
    public class ModuleModel
    {
        public Int64 Id { get; set; }
        public Int64 TenantId { get; set; }
        public Int64 UserId { get; set; }
        public string Name { get; set; }
        [Column(TypeName = "datetime")]
        public DateTimeOffset CreatedAt { get; set; }
        [Column(TypeName = "datetime")]
        public DateTimeOffset UpdatedAt { get; set; }
    }

}
