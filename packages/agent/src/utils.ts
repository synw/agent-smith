function extractBetweenTags(
    text: string,
    startTag: string,
    endTag: string,
) {
    try {
        // Find start position
        const startIndex = text.indexOf(startTag);
        if (startIndex === -1) return text;

        // Calculate content boundaries
        let contentStart = startIndex + startTag.length;
        let contentEnd;

        if (endTag) {
            contentEnd = text.indexOf(endTag, contentStart);
            if (contentEnd === -1) return text;
        } else {
            // Find next newline for self-closing tags
            contentEnd = text.indexOf('\n', contentStart);
            if (contentEnd === -1) contentEnd = text.length;
        }

        // Extract content
        return text.substring(contentStart, contentEnd).trim();
    } catch (error) {
        throw new Error(`Error parsing content between tags ${startTag} ${endTag}: ${error}`);
    }
}

function splitThinking(text: string, startTag: string, endTag: string): { think: string, finalAnswer: string } {
    let think = "";
    let answer = "";
    const st = text.split(endTag);
    if (st.length > 1) {
        think = extractBetweenTags(text, startTag, endTag).trim();
        answer = st[1].trim()
    } else {
        answer = text
    }
    return { think: think, finalAnswer: answer }
}

export {
    extractBetweenTags,
    splitThinking,
}