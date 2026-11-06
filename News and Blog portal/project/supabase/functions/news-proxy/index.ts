const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-News-Key",
};

const API_URL = "https://newsapi.org/v2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint") || "top-headlines";

    const allowedEndpoints = ["top-headlines", "everything"];
    if (!allowedEndpoints.includes(endpoint)) {
      return new Response(
        JSON.stringify({ error: "Invalid endpoint" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newsApiKey = req.headers.get("X-News-Key") || Deno.env.get("NEWS_API_KEY") || "";
    if (!newsApiKey) {
      return new Response(
        JSON.stringify({ status: "error", code: "apiKeyMissing", message: "No API key provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiUrl = new URL(`${API_URL}/${endpoint}`);
    apiUrl.searchParams.set("apiKey", newsApiKey);

    const allowedParams = [
      "country", "category", "language", "pageSize", "page",
      "q", "sortBy", "domains", "from", "to",
    ];
    for (const param of allowedParams) {
      const value = url.searchParams.get(param);
      if (value) apiUrl.searchParams.set(param, value);
    }

    if (!apiUrl.searchParams.has("language")) {
      apiUrl.searchParams.set("language", "en");
    }
    if (!apiUrl.searchParams.has("pageSize")) {
      apiUrl.searchParams.set("pageSize", "20");
    }

    const apiRes = await fetch(apiUrl.toString());
    const data = await apiRes.json();

    if (!apiRes.ok) {
      return new Response(
        JSON.stringify({
          status: "error",
          code: data.code || `error_${apiRes.status}`,
          message: data.message || "News API request failed",
        }),
        { status: apiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        code: "proxy_error",
        message: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
