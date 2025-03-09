import sys
from duckduckgo_search import DDGS

if len(sys.argv) < 2:
    raise ValueError("Provide a search query")
results = DDGS().text(sys.argv[1], max_results=5)
print(results)
