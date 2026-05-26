using SideKick.Server.DTOs;
using SideKick.Server.Enums;

namespace SideKick.Server.Services
{
  public interface IGigContractsService
  {
    public List<GigContractResponseDto> GetAllGigContracts();
    public List<GigContractResponseDto> GetAllGigContractsOfClient(int userId);
    public List<GigContractResponseDto> GetAllGigContractsOfFreelancer(int userId);
    public GigContractResponseDto CreateGigContract(int applicationId);
    public GigContractResponseDto? GetGigContractById(int gigApplicationId);
    public GigContractResponseDto? GetGigContractByPostIdAndApplicationId(int postId, int applicationId);
    public void DeleteGigContractById(int gigApplicationId);
    public void UpdateGigContractStatus(int gigContractId, ContractStatus status);
  }
}
