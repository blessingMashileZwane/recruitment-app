export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};

export type Job = {
    id: number;
    title: string;
    description: string;
    company: string;
    location: string;
};

export type Application = {
    id: number;
    userId: number;
    jobId: number;
    status: 'applied' | 'interview' | 'offer' | 'rejected';
};