export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return Response.json(
        { error: "Please enter a travel query." },
        { status: 400 }
      );
    }

    // Tavily Internet Search
    const tavilyResponse = await fetch(
      "https://api.tavily.com/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          search_depth: "advanced",
          max_results: 5,
          include_answer: true,
        }),
      }
    );

    const tavilyData = await tavilyResponse.json();

    const searchResults =
      tavilyData.results
        ?.map(
          (item: any, index: number) =>
            `${index + 1}. ${item.title}

URL: ${item.url}

${item.content}`
        )
        .join("\n\n") || "No search results found.";

    // OpenRouter AI
    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an expert AI travel planner. Create detailed travel plans with itinerary, attractions, hotel recommendations, food suggestions, budget planning, weather advice and travel tips.",
            },
            {
              role: "user",
              content: `
Travel Request:

${query}

Internet Search Results:

${searchResults}

Create a complete travel plan.
`,
            },
          ],
        }),
      }
    );

    const aiData = await aiResponse.json();

    return Response.json({
      answer:
        aiData?.choices?.[0]?.message?.content ||
        tavilyData.answer ||
        "No response generated.",
      sources: tavilyData.results || [],
    });
  } catch (error) {
    console.error("API Error:", error);

    return Response.json(
      {
        error: "Failed to generate AI trip plan.",
      },
      {
        status: 500,
      }
    );
  }
}