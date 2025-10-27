namespace LernApp.Api.DTOs.Responses;

public record IdentityResponse(string? Error = null)
{
    public bool Success => string.IsNullOrWhiteSpace(Error);
}