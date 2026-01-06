
import { IApsrdmsSolutionProps } from '../../components/IApsrdmsSolutionProps';
// import { Web } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import useSPCRUDOPS, { ISPCRUDOPS } from '../../services/dal/spcrudops';
import SPCRUDOPS from '../../services/dal/spcrudops';


export interface ISPCRUD {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsSolutionProps): Promise<any>;
    getTopData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
            , orderby: { column: string, isAscending: boolean }, top: number, props: IApsrdmsSolutionProps): Promise<any>;
    getDataAnotherSiteCollection(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsSolutionProps): Promise<any>;
    insertData(listName: string, data: any, props: IApsrdmsSolutionProps): Promise<any>;
    updateData(listName: string, itemId: number, data: any, props: IApsrdmsSolutionProps): Promise<any>;
    deleteData(listName: string, itemId: number, props: IApsrdmsSolutionProps): Promise<any>;
    getListInfo(listName: string, props: IApsrdmsSolutionProps): Promise<any>;
    getListData(listName: string, columnsToRetrieve: string, props: IApsrdmsSolutionProps): Promise<any>;
    // batchInsert(listName: string, data: any, props: IApsrdmsSolutionProps): Promise<any>;
    // batchUpdate(listName: string, data: any, props: IApsrdmsSolutionProps): Promise<any>;
    // batchDelete(listName: string, data: any, props: IApsrdmsSolutionProps): Promise<any>;
    createFolder(libraryName: string, folderName: string, props: IApsrdmsSolutionProps): Promise<any>;
    uploadFile(folderServerRelativeUrl: string, file: File, props: IApsrdmsSolutionProps): Promise<any>;
    deleteFile(fileServerRelativeUrl: string, props: IApsrdmsSolutionProps): Promise<any>;
    currentProfile(props: IApsrdmsSolutionProps): Promise<any>;
    currentUser(props: IApsrdmsSolutionProps): Promise<any>;
    currentUserGroups(props: IApsrdmsSolutionProps): Promise<any>;
    parentCurrentUserGroups(props: IApsrdmsSolutionProps): Promise<any>;
    getSiteUsers(props: IApsrdmsSolutionProps): Promise<any>;
    // getAllItemsRecursively(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
    //     , orderby: { column: string, isAscending: boolean }, items: any[], startItemId?: number, itemCount?: number, props?: IApsrdmsSolutionProps): Promise<any>;
    // getContentType(libraryName:string, props: IApsrdmsSolutionProps): Promise<any>;
    // uploadContentTypeFile(fileName: string, ContentTypeId: string, templateFileUrl: string, folderServerRelativeUrl: string, props: IApsrdmsSolutionProps): Promise<any>;
    // getBatchData(listDetails: any[], props: IApsrdmsSolutionProps): Promise<any>;
    getFolderContent(folderServerRelativeUrl: string, props: IApsrdmsSolutionProps): Promise<any>;
    createDocumentLibrary(libraryName: string, props: IApsrdmsSolutionProps): Promise<any>;
    getAllCustomLibrary(columnsToRetrieve: string, filters: string, props: IApsrdmsSolutionProps): Promise<any>;
    // addColumnsLibrary(columns: any, libraryName: string, props: IApsrdmsSolutionProps): Promise<any>;
    // getLibraryFileAsArrayBuffer(folderServerRelativeUrl: string, props: IApsrdmsSolutionProps): Promise<any>;


}

export default async function SPCRUD(): Promise<ISPCRUD> {
    const spCrudOps = SPCRUDOPS();

    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsSolutionProps) => {
        const items: any[] = await (await spCrudOps).getData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };

    const getTopData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, top: number, props: IApsrdmsSolutionProps) => {
        const items: any[] = await (await spCrudOps).getTopData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, top, props);
        return items;
    };

    const getDataAnotherSiteCollection = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsSolutionProps) => {
        const items: any[] = await (await spCrudOps).getDataAnotherSiteCollection(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };

    const insertData = async (listName: string, data: any, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).insertData(listName, data, props);
        // await sp.web.lists.add("My new list");
        return result;
    };

    const updateData = async (listName: string, itemId: number, data: any, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).updateData(listName, itemId, data, props);
        return result;
    };

    const deleteData = async (listName: string, itemId: number, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).deleteData(listName, itemId, props);
        return result;
    };

    const getListInfo = async (listName: string, props: IApsrdmsSolutionProps) => {
        const list: any = await (await spCrudOps).getListInfo(listName, props);
        return list;
    };

    const getListData = async (listName: string, columnsToRetrieve: string, props: IApsrdmsSolutionProps) => {
        const list: any = await (await spCrudOps).getListData(listName, columnsToRetrieve, props);
        return list;
    };

    // const batchInsert = async (listName: string, data: any, props: IApsrdmsSolutionProps) => {
    //     const result: any = await (await spCrudOps).batchInsert(listName, data, props);
    //     return result;
    // };

    // const batchUpdate = async (listName: string, data: any, props: IApsrdmsSolutionProps) => {
    //     const result: any = await (await spCrudOps).batchUpdate(listName, data, props);
    //     return result;
    // };

    // const batchDelete = async (listName: string, data: any, props: IApsrdmsSolutionProps) => {
    //     const result: any = await (await spCrudOps).batchDelete(listName, data, props);
    //     return result;
    // };
    const createFolder = async (libraryName: string, folderName: string, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).createFolder(libraryName, folderName, props);
        return result;
    };
    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).uploadFile(folderServerRelativeUrl, file, props);
        return result;
    };
    const deleteFile = async (fileServerRelativeUrl: string, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).deleteFile(fileServerRelativeUrl, props);
        return result;
    };
    const currentProfile = async (props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).currentProfile(props);
        return result;
    };
    const currentUser = async (props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).currentUser(props);
        return result;
    };
    const currentUserGroups = async (props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).currentUserGroups(props);
        return result;
    };
    const parentCurrentUserGroups = async (props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).parentCurrentUserGroups(props);
        return result;
    };

    const getSiteUsers = async (props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).getSiteUsers(props);
        return result;
    };
    // const getAllItemsRecursively = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
    //     , orderby: { column: string, isAscending: boolean }, items1: any[] = [], startItemId?: number, itemCount?: number, props?: IApsrdmsSolutionProps) => {
    //     const items: any[] = await (await spCrudOps).getAllItemsRecursively(listName, columnsToRetrieve, columnsToExpand, filters, orderby, items1, startItemId, itemCount, props);
    //     return items;
    // };
    // const getContentType = async (libraryName: string, props: IApsrdmsSolutionProps) => {
    //     const result: any = await (await spCrudOps).getContentType(libraryName, props);
    //     return result;
    // };

    // const uploadContentTypeFile = async (fileName: string, ContentTypeId: string, templateFileUrl: string, folderServerRelativeUrl: string, props: IApsrdmsSolutionProps) => {
    //     const result: any = await (await spCrudOps).uploadContentTypeFile(fileName, ContentTypeId, templateFileUrl, folderServerRelativeUrl, props);
    //     return result;
    // };

    // const getBatchData = async (listDetails: any[], props: IApsrdmsSolutionProps) => {
    //     const result: any = await (await spCrudOps).getBatchData(listDetails, props);
    //     return result;
    // };

    const getFolderContent = async (folderServerRelativeUrl: string, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).getFolderContent(folderServerRelativeUrl, props);
        return result;
    };
    const createDocumentLibrary = async (libraryName: string, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).createDocumentLibrary(libraryName, props);
        return result;
    };
    const getAllCustomLibrary = async (columnsToRetrieve: string, filters: string, props: IApsrdmsSolutionProps) => {
        const result: any = await (await spCrudOps).getAllCustomLibrary(columnsToRetrieve, filters, props);
        return result;
    };
    // const addColumnsLibrary = async (columns: any, libraryName: string, props: IApsrdmsSolutionProps) => {
    //     const result: any = await (await spCrudOps).addColumnsLibrary(columns, libraryName, props);
    //     return result;
    // };

    

    return {
        getData,
        getTopData,
        getDataAnotherSiteCollection,
        insertData,
        updateData,
        deleteData,
        getListInfo,
        getListData,
        // batchInsert,
        // batchUpdate,
        // batchDelete,
        createFolder,
        uploadFile,
        deleteFile,
        currentProfile,
        currentUser,
        parentCurrentUserGroups,
        currentUserGroups,
        getSiteUsers,
        // getAllItemsRecursively,
        // getContentType,
        // uploadContentTypeFile,
        // getBatchData,
        getFolderContent,
        createDocumentLibrary,
        getAllCustomLibrary
        // getLibraryFileAsArrayBuffer
    };
}