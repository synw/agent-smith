"""
description: Transcript a Youtube video to text from a video id
parameters:
    video_id: string
    prompt: string
"""

import json
import sys
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

nargs = len(sys.argv)
if nargs < 3:
    raise ValueError("Provide a video id and a prompt")
langs = []
if nargs >= 4:
    for ln in sys.argv[3].split(","):
        langs.append(ln)
langs.append("en")
vid = sys.argv[1]
#print("Fetching video", vid)
transcript = YouTubeTranscriptApi().fetch(
    vid,
    preserve_formatting=True,
    languages=langs,
)
formatter = TextFormatter()
txt = formatter.format_transcript(transcript)
res = {"prompt": txt, "instructions": sys.argv[2]}
print(json.dumps(res))
