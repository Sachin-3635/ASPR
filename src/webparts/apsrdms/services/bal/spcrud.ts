
import { IApsrdmsProps } from '../../components/IApsrdmsProps';
// import { Web } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import useSPCRUDOPS, { ISPCRUDOPS } from '../../services/dal/spcrudops';
import SPCRUDOPS from '../../services/dal/spcrudops';


export interface ISPCRUD {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsProps): Promise<any>;
    getTopData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
            , orderby: { column: string, isAscending: boolean }, top: number, props: IApsrdmsProps): Promise<any>;
    getDataAnotherSiteCollection(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsProps): Promise<any>;
    insertData(listName: string, data: any, props: IApsrdmsProps): Promise<any>;
    updateData(listName: string, itemId: number, data: any, props: IApsrdmsProps): Promise<any>;
    deleteData(listName: string, itemId: number, props: IApsrdmsProps): Promise<any>;
    getListInfo(listName: string, props: IApsrdmsProps): Promise<any>;
    getListData(listName: string, columnsToRetrieve: string, props: IApsrdmsProps): Promise<any>;
    // batchInsert(listName: string, data: any, props: IApsrdmsProps): Promise<any>;
    // batchUpdate(listName: string, data: any, props: IApsrdmsProps): Promise<any>;
    // batchDelete(listName: string, data: any, props: IApsrdmsProps): Promise<any>;
    createFolder(libraryName: string, folderName: string, props: IApsrdmsProps): Promise<any>;
    uploadFile(folderServerRelativeUrl: string, file: File, props: IApsrdmsProps): Promise<any>;
    deleteFile(fileServerRelativeUrl: string, props: IApsrdmsProps): Promise<any>;
    currentProfile(props: IApsrdmsProps): Promise<any>;
    currentUser(props: IApsrdmsProps): Promise<any>;
    currentUserGroups(props: IApsrdmsProps): Promise<any>;
    parentCurrentUserGroups(props: IApsrdmsProps): Promise<any>;
    getSiteUsers(props: IApsrdmsProps): Promise<any>;
    // getAllItemsRecursively(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
    //     , orderby: { column: string, isAscending: boolean }, items: any[], startItemId?: number, itemCount?: number, props?: IApsrdmsProps): Promise<any>;
    // getContentType(libraryName:string, props: IApsrdmsProps): Promise<any>;
    // uploadContentTypeFile(fileName: string, ContentTypeId: string, templateFileUrl: string, folderServerRelativeUrl: string, props: IApsrdmsProps): Promise<any>;
    // getBatchData(listDetails: any[], props: IApsrdmsProps): Promise<any>;
    getFolderContent(folderServerRelativeUrl: string, props: IApsrdmsProps): Promise<any>;
    createDocumentLibrary(libraryName: string, props: IApsrdmsProps): Promise<any>;
    getAllCustomLibrary(columnsToRetrieve: string, filters: string, props: IApsrdmsProps): Promise<any>;
    // addColumnsLibrary(columns: any, libraryName: string, props: IApsrdmsProps): Promise<any>;
    // getLibraryFileAsArrayBuffer(folderServerRelativeUrl: string, props: IApsrdmsProps): Promise<any>;


}

export default async function SPCRUD(): Promise<ISPCRUD> {
    const spCrudOps = SPCRUDOPS();

    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsProps) => {
        const items: any[] = await (await spCrudOps).getData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };

    const getTopData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, top: number, props: IApsrdmsProps) => {
        const items: any[] = await (await spCrudOps).getTopData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, top, props);
        return items;
    };

    const getDataAnotherSiteCollection = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IApsrdmsProps) => {
        const items: any[] = await (await spCrudOps).getDataAnotherSiteCollection(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };

    const insertData = async (listName: string, data: any, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).insertData(listName, data, props);
        // await sp.web.lists.add("My new list");
        return result;
    };

    const updateData = async (listName: string, itemId: number, data: any, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).updateData(listName, itemId, data, props);
        return result;
    };

    const deleteData = async (listName: string, itemId: number, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).deleteData(listName, itemId, props);
        return result;
    };

    const getListInfo = async (listName: string, props: IApsrdmsProps) => {
        const list: any = await (await spCrudOps).getListInfo(listName, props);
        return list;
    };

    const getListData = async (listName: string, columnsToRetrieve: string, props: IApsrdmsProps) => {
        const list: any = await (await spCrudOps).getListData(listName, columnsToRetrieve, props);
        return list;
    };

    // const batchInsert = async (listName: string, data: any, props: IApsrdmsProps) => {
    //     const result: any = await (await spCrudOps).batchInsert(listName, data, props);
    //     return result;
    // };

    // const batchUpdate = async (listName: string, data: any, props: IApsrdmsProps) => {
    //     const result: any = await (await spCrudOps).batchUpdate(listName, data, props);
    //     return result;
    // };

    // const batchDelete = async (listName: string, data: any, props: IApsrdmsProps) => {
    //     const result: any = await (await spCrudOps).batchDelete(listName, data, props);
    //     return result;
    // };
    const createFolder = async (libraryName: string, folderName: string, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).createFolder(libraryName, folderName, props);
        return result;
    };
    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).uploadFile(folderServerRelativeUrl, file, props);
        return result;
    };
    const deleteFile = async (fileServerRelativeUrl: string, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).deleteFile(fileServerRelativeUrl, props);
        return result;
    };
    const currentProfile = async (props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).currentProfile(props);
        return result;
    };
    const currentUser = async (props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).currentUser(props);
        return result;
    };
    const currentUserGroups = async (props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).currentUserGroups(props);
        return result;
    };
    const parentCurrentUserGroups = async (props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).parentCurrentUserGroups(props);
        return result;
    };

    const getSiteUsers = async (props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).getSiteUsers(props);
        return result;
    };
    // const getAllItemsRecursively = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
    //     , orderby: { column: string, isAscending: boolean }, items1: any[] = [], startItemId?: number, itemCount?: number, props?: IApsrdmsProps) => {
    //     const items: any[] = await (await spCrudOps).getAllItemsRecursively(listName, columnsToRetrieve, columnsToExpand, filters, orderby, items1, startItemId, itemCount, props);
    //     return items;
    // };
    // const getContentType = async (libraryName: string, props: IApsrdmsProps) => {
    //     const result: any = await (await spCrudOps).getContentType(libraryName, props);
    //     return result;
    // };

    // const uploadContentTypeFile = async (fileName: string, ContentTypeId: string, templateFileUrl: string, folderServerRelativeUrl: string, props: IApsrdmsProps) => {
    //     const result: any = await (await spCrudOps).uploadContentTypeFile(fileName, ContentTypeId, templateFileUrl, folderServerRelativeUrl, props);
    //     return result;
    // };

    // const getBatchData = async (listDetails: any[], props: IApsrdmsProps) => {
    //     const result: any = await (await spCrudOps).getBatchData(listDetails, props);
    //     return result;
    // };

    const getFolderContent = async (folderServerRelativeUrl: string, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).getFolderContent(folderServerRelativeUrl, props);
        return result;
    };
    const createDocumentLibrary = async (libraryName: string, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).createDocumentLibrary(libraryName, props);
        return result;
    };
    const getAllCustomLibrary = async (columnsToRetrieve: string, filters: string, props: IApsrdmsProps) => {
        const result: any = await (await spCrudOps).getAllCustomLibrary(columnsToRetrieve, filters, props);
        return result;
    };
    // const addColumnsLibrary = async (columns: any, libraryName: string, props: IApsrdmsProps) => {
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