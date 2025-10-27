namespace LernApp.Api.DTOs.Requests;

public record AccountCreateRequest(string UserName, string Mail, string Password);