export function getSnippet(content: string) {
    if (!content) return "No content available.";
    const text = content.replace(/#+\s+.+\n/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/[*_]/g, '').trim();
    return text.substring(0, 100) + (text.length > 100 ? '...' : '');
}
