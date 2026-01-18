using LernApp.Models.Data;

namespace LernApp.Api.Models;

public class DeckResponseModel : DeckData
{
    public int CardCount { get; set; }
    public DateOnly LastLearned { get; set; }
    
    public int CardsNew { get; set; }
    public int CardsLearning { get; set; }
    public int CardsReviewing { get; set; }
}

public class DeckDetailResponseModel : DeckData
{
    public List<CardData> Cards { get; set; } = [];
}

/**


**/