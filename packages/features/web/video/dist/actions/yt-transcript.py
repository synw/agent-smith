"""
description: Transcript a Youtube video to text from a video id
parameters:
    video_id: string
"""

import sys
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

nargs = len(sys.argv)
if nargs < 2:
    raise ValueError("Provide a video id")
transcript = YouTubeTranscriptApi.get_transcript(sys.argv[1], preserve_formatting=True)
formatter = TextFormatter()
txt = formatter.format_transcript(transcript)
print(txt)
