export interface Idea {
    id: string;
    filename: string;
    stage: string;
    title: string;
    content: string;
    specContent?: string | null;
    timestamp: number;
    dateStr: string;
    htmlContent?: string;
    specHtml?: string | null;
}
