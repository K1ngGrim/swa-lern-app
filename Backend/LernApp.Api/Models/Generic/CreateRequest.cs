namespace LernApp.Api.Models.Generic;

public record CreateRequest<TData>(Guid? EntityId, TData Data);