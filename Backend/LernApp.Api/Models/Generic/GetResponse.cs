namespace LernApp.Api.Models;

public record GetResponse<TData>(Guid EntryId, TData Data);