export interface IPaginationOptions {
    limit: number;
    page: number;
    route?: string;
    order?: 'ASC' | 'DESC';
    orderBy?: string;
    where?: [{}];
}
