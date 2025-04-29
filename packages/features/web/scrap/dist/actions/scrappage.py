"""
# tool
description: Retrieve a webpage's content
arguments:
    url:
        description: The url of the web page to read
"""

import asyncio
import sys
from crawl4ai import AsyncWebCrawler
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig


async def main():
    if len(sys.argv) < 2:
        raise ValueError("Provide an url")
    run_config = dict(
        verbose=False,
        word_count_threshold=10,
        remove_overlay_elements=True,
        process_iframes=True,
        excluded_tags=["form", "header", "footer", "nav"],
        delay_before_return_html=1,
        # wait_for="js:() => window.loaded === true",
    )
    # print("URL", sys.argv[1])
    # print("ARGS", sys.argv[2:])
    for arg in sys.argv[2:]:
        if "=" in arg:
            l = arg.split("=")
            k = l[0]
            v = l[1]
            if k == "delay":
                k = "delay_before_return_html"
                v = int(v)
            if k == "minwords":
                k = "word_count_threshold"
            if k == "extags":
                k = "excluded_tags"
                v = v.split(",")
            # support boolean options
            if v == "true":
                v = True
            if v == "false":
                v = False
            run_config[k] = v
    run_config = CrawlerRunConfig(**run_config)
    browser_config = BrowserConfig()

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=sys.argv[1], config=run_config)
        md = result.markdown.split("\n")[2:]
        print("\n".join(md))


asyncio.run(main())
