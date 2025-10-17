export interface PQR {
    id: string;
    userId: string;
    comment:string;
    status: 'open' | 'in_progress' | 'closed';
}