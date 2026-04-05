namespace MeowLang.API.DTOs.Requests
{
    public class SubmitTestRequest
    {
        // Which content item is being tested
        public int ContentItemId { get; set; }

        // Which part of the sublevel
        public int PartNumber { get; set; }

        // 1 = writing test, 2 = speaking test
        public int TestNumber { get; set; }

        // The answer the user typed or spoke
        public required string UserAnswer { get; set; }

        // Which sublevel this test belongs to
        public int SubLevelId { get; set; }
    }
}
