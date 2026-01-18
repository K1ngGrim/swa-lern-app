using LernApp.Api.Models;
using LernApp.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LernApp.Api.Controller;

[ApiController]
[Route("api/statistic")]
public class StatisticController(StatisticService statService) : ControllerBase
{

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<StatisticResponseModel>> HeatMapData([FromQuery] Guid? deckId)
    {
        return await statService.GetHeatMapDataAsync(User, deckId);
    }

    [HttpGet("summary")]
    [Authorize]
    public async Task<ActionResult<StatisticSummaryResponseModel>> StatisticSummary()
    {
        return await statService.GetStatisticsSummary(User);
    }
    
    
}