export type QuickLink = {
    title: string;
    url: string;
};

export type User = {
    username: string;
    firstName: string;
};

export type StashSection = {
    content: string;
    type: 'code' | 'text';
};

export type Stash = {
    id?: string; // Optional, as it might not exist when creating a new stash
    createdAt: string;
    updatedAt?: string;
    desc: string;
    stashSections: StashSection[];
    tags: string[];
    title: string;
};

