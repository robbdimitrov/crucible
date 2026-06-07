import { describe, it, expect } from 'vitest';
import { getSnippet } from './utils';

describe('getSnippet', () => {
    it('should strip markdown formatting and return a shortened snippet', () => {
        const content = "# Main Title\n\n**Bold text** and [a link](https://example.com) _italic_.";
        expect(getSnippet(content)).toBe("Bold text and a link italic.");
    });
    
    it('should truncate texts longer than 100 characters', () => {
        const content = "This is a very long string that goes on and on and on and on and on and on and on and on and on and on and on.";
        expect(getSnippet(content)).toBe("This is a very long string that goes on and on and on and on and on and on and on and on and on and ...");
    });
    
    it('should return default text if content is empty', () => {
        expect(getSnippet('')).toBe("No content available.");
    });
});
