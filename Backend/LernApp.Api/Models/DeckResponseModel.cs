using LernApp.Models.Data;

namespace LernApp.Api.Models;

public class DeckResponseModel : DeckData
{

}

public class DeckDetailResponseModel : DeckData
{
    public List<CardData> Cards { get; set; } = [];
}