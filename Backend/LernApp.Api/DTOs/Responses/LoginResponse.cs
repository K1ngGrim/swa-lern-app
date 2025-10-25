namespace LernApp.Api.DTOs.Responses;

public record LoginResponse(string? Error = null)
{
    public bool Success => string.IsNullOrWhiteSpace(Error);
}