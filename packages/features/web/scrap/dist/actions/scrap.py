import sys
import json
from scrapegraphai.graphs import SmartScraperGraph

MODEL = "ollama/mistral-small:latest"

nargs = len(sys.argv)
if nargs < 3:
    raise ValueError("Provide arguments: http address and prompt")
if nargs > 3:
    for arg in sys.argv[2:]:
        if arg.startswith("m="):
            MODEL = arg.split("=")[1]

# sys.stderr.write("MODEL: " + MODEL + "\n")

graph_config = {
    "llm": {
        "model": MODEL,
        "temperature": 0.2,
        "format": "json",
        "model_tokens": 16394,
        "base_url": "http://localhost:11434",
    },
    "embeddings": {
        "model": "ollama/nomic-embed-text",
        "temperature": 0,
        "base_url": "http://localhost:11434",
    },
    # "verbose": True,
    "headless": False,
}


smart_scraper_graph = SmartScraperGraph(
    prompt=sys.argv[2],
    # also accepts a string with the already downloaded HTML code
    source=sys.argv[1],
    config=graph_config,
)

result = smart_scraper_graph.run()
# print(result)
print(json.dumps(result, indent=4))
