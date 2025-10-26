namespace LernApp.Api.Models;

public record ListResponse<T>(List<T> Data, int TotalCount);