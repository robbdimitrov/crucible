import { describe, it, expect } from 'vitest';
import { extractTitle, extractTimestamp, slugify, ideaFilename } from './ideas';

describe('extractTitle', () => {
    it('prefers the first markdown H1 in the content', () => {
        expect(extractTitle('whatever-1780822753436.md', '# Barbershop Booking Tool\n\nbody')).toBe(
            'Barbershop Booking Tool'
        );
    });

    it('falls back to the de-slugified filename, stripping the timestamp', () => {
        expect(extractTitle('barbershop-booking-tool-1780822753436.md', 'no heading here')).toBe(
            'barbershop booking tool'
        );
    });

    it('falls back to the filename when there is no timestamp suffix', () => {
        expect(extractTitle('my-cool-idea.md', '')).toBe('my cool idea');
    });

    it('ignores non-H1 headings', () => {
        expect(extractTitle('thing.md', '## Subheading\n\ntext')).toBe('thing');
    });
});

describe('extractTimestamp', () => {
    it('reads the 13-digit timestamp embedded in the filename', () => {
        expect(extractTimestamp('idea-1780822753436.md', 0)).toBe(1780822753436);
    });

    it('uses the fallback when no timestamp is present', () => {
        expect(extractTimestamp('hand-written-idea.md', 42)).toBe(42);
    });

    it('does not match timestamps that are the wrong length', () => {
        expect(extractTimestamp('idea-123.md', 99)).toBe(99);
    });
});

describe('slugify', () => {
    it('lowercases and replaces runs of non-alphanumerics with single dashes', () => {
        expect(slugify('Scheduling for Dog Groomers!')).toBe('scheduling-for-dog-groomers');
    });

    it('trims leading and trailing dashes', () => {
        expect(slugify('  ...Hello, World...  ')).toBe('hello-world');
    });
});

describe('ideaFilename', () => {
    it('combines the slug with the timestamp and .md extension', () => {
        expect(ideaFilename('Bakery Order Manager', 1780822753436)).toBe(
            'bakery-order-manager-1780822753436.md'
        );
    });

    it('round-trips through extractTitle and extractTimestamp', () => {
        const name = ideaFilename('Gym Membership Sync', 1780822753436);
        expect(extractTimestamp(name, 0)).toBe(1780822753436);
        expect(extractTitle(name, 'no heading')).toBe('gym membership sync');
    });
});
