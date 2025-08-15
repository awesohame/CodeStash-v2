export type QuickLink = {
    id: string; // unique identifier
    title: string;
    url: string;
    icon?: string; // url
};

export type StashSection = {
    content: string;
    type: 'code' | 'text';
};

export type Stash = {
    id?: string;
    createdAt: string;
    updatedAt?: string;
    desc: string;
    stashSections: StashSection[];
    tags: string[];
    title: string;
    isPinned: boolean;
};

