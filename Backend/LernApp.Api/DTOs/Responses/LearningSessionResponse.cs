using LernApp.Api.Models;
using LernApp.Models.Data;

namespace LernApp.Api.DTOs.Responses;

public class LearningSessionResponse
{
    public Guid SessionId { get; set; } = Guid.NewGuid();
    public List<CardResponseModel> Cards { get; set; } = [];
}