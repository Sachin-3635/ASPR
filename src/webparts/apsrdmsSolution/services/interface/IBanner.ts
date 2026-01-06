export interface IBanner {
    Id: number;
    EncodedAbsUrl:any;
    Title: string;
    Status: string;
    Created: string;
    CreatedBy?: string; // New
    IsFolder: boolean; // To distinguish folders
    FileRef: string; // Full path to the item
    FileDirRef: string;
}
