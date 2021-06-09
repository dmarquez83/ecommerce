// project configuration interface
export interface IProjectConfiguration {
    id: string;
    serverKey: string;
    databaseURL: string;
    serviceAccount: any;
}

// Project data interface
export interface IProjectData {
    id: string;
    ref: any;
    serverKey: string;
}
