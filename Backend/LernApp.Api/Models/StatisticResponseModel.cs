using LernApp.Models.Entities;

namespace LernApp.Api.Models;

public class StatisticResponseModel
{
    public System.Collections.Generic.List<StatisticModel> Data { get; set; } = [];
}

public class StatisticModel : StatisticBase;

public class StatisticSummaryResponseModel
{
    public int LearnedToday { get; set; }
    public int LearnedThisWeek { get; set; }
}