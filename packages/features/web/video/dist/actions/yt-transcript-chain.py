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
lang = "en"
if nargs >= 4:
    lang = sys.argv[3]
langs = tuple(lang.split(","))
transcript = YouTubeTranscriptApi.get_transcript(
    sys.argv[1],
    preserve_formatting=True,
    languages=langs,
)
formatter = TextFormatter()
txt = formatter.format_transcript(transcript)
res = {"prompt": txt, "instructions": sys.argv[2]}
print(json.dumps(res))
