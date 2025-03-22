"""
# tool
description: Web search
arguments:
    query:
        description: The search query
"""

import sys
from duckduckgo_search import DDGS

# print("AARGS", sys.argv)
if len(sys.argv) < 2:
    raise ValueError("Provide a search query")
results = DDGS().text(sys.argv[1], max_results=5)
print(results)
