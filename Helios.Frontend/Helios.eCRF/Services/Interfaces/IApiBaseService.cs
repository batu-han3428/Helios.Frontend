namespace Helios.eCRF.Services.Interfaces
{
    public interface IApiBaseService
    {
        Int64 UserId { get; set; }
        Int64 StudyId { get; set; }
        Int64 TenantId { get; set; }
        void OnServiceInstanceCreated();
    }
}
