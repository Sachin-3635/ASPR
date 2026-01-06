
import { IApsrdmsSolutionProps } from "../../components/IApsrdmsSolutionProps";
import SPCRUDOPS from '../dal/spcrudops';
import { IBanner } from '../interface/IBanner';
export interface IBannerOps {
    getAllBanner(props: IApsrdmsSolutionProps): Promise<IBanner[]>;
    getBannerById(Id: string | number, props: IApsrdmsSolutionProps): Promise<IBanner>;
    getBanner(columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsSolutionProps)
    getTopBanner(columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, top: number, props: IApsrdmsSolutionProps)
}

export default function BannerOps() {
    const spCrudOps = SPCRUDOPS();

    const getAllBanner = async (props: IApsrdmsSolutionProps): Promise<IBanner[]> => {
        return await (await spCrudOps).getData("Banner", "*,Id,EncodedAbsUrl,FileLeafRef,FileDirRef,FileRef,FSObjType,Created,Status", "", ""
            , { column: 'Id', isAscending: false }, props).then(results => {
                var output: Array<IBanner> = new Array<IBanner>();
                results.map(item => {
                    output.push({
                        Id: item.Id,
                        EncodedAbsUrl: item.EncodedAbsUrl,
                        Title: item.FileLeafRef, // File or folder name
                        Status: item.Status, // Status column
                        Created: item.Created, // Created date
                        CreatedBy: item.Author?.Title || "", // Add Created By
                        IsFolder: item.FSObjType === 1, // Check if it's a folder
                        FileRef: item.FileRef, // URL to the file/folder
                        FileDirRef: item.FileDirRef
                    });
                });
                return output;
            });
    };

    const getBannerById = async (Id: string | number, props: IApsrdmsSolutionProps): Promise<IBanner> => {
        return await (await spCrudOps).getData("Banner", "*,Id,EncodedAbsUrl,FileLeafRef,FileDirRef,FileRef,FSObjType,Created,Status", "", "ID eq " + Id + ""
            , { column: 'Id', isAscending: false }, props).then(results => {
                var output: Array<IBanner> = new Array<IBanner>();
                results.map(item => {
                    output.push({
                        Id: item.Id,
                        EncodedAbsUrl: item.EncodedAbsUrl,
                        Title: item.FileLeafRef, // File or folder name
                        Status: item.Status, // Status column
                        Created: item.Created, // Created date
                        CreatedBy: item.Author?.Title || "", // Add Created By
                        IsFolder: item.FSObjType === 1, // Check if it's a folder
                        FileRef: item.FileRef, // URL to the file/folder
                        FileDirRef: item.FileDirRef
                    });
                });
                return output[0];
            });
    };

    const getBanner = async (columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsSolutionProps): Promise<IBanner[]> => {
        return await (await spCrudOps).getData("Banner", "*,Id,EncodedAbsUrl,FileLeafRef,FileDirRef,FileRef,FSObjType,Created,Status", columnsToExpand, filters
            , orderby, props).then(results => {
                var output: Array<IBanner> = new Array<IBanner>();
                results.map(item => {
                    output.push({
                        Id: item.Id,
                        EncodedAbsUrl: item.EncodedAbsUrl,
                        Title: item.FileLeafRef, // File or folder name
                        Status: item.Status, // Status column
                        Created: item.Created, // Created date
                        CreatedBy: item.Author?.Title || "", // Add Created By
                        IsFolder: item.FSObjType === 1, // Check if it's a folder
                        FileRef: item.FileRef, // URL to the file/folder
                        FileDirRef: item.FileDirRef

                    });
                });
                return output;
            });
    };

    const getTopBanner = async (columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, top: number, props: IApsrdmsSolutionProps): Promise<IBanner[]> => {
        return await (await spCrudOps).getTopData("Banner", "*,Id,EncodedAbsUrl,FileLeafRef,FileDirRef,FileRef,FSObjType,Created,Status", columnsToExpand, filters
            , orderby, top, props).then(results => {
                var output: Array<IBanner> = new Array<IBanner>();
                results.map(item => {
                    output.push({
                        Id: item.Id,
                        EncodedAbsUrl: item.EncodedAbsUrl,
                        Title: item.FileLeafRef, // File or folder name
                        Status: item.Status, // Status column
                        Created: item.Created, // Created date
                        CreatedBy: item.Author?.Title || "", // Add Created By
                        IsFolder: item.FSObjType === 1, // Check if it's a folder
                        FileRef: item.FileRef, // URL to the file/folder
                        FileDirRef: item.FileDirRef

                    });
                });
                return output;
            });
    };

    return {
        getAllBanner,
        getBannerById,
        getBanner,
        getTopBanner
    };

}