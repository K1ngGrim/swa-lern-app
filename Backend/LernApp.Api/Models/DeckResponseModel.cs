using LernApp.Models.Data;

namespace LernApp.Api.Models;

public class DeckResponseModel : DeckData
{
    public int CardCount { get; set; }
    public DateOnly LastLearned { get; set; }
}

public class DeckDetailResponseModel : DeckData
{
    public List<CardData> Cards { get; set; } = [];
}

/**


**/