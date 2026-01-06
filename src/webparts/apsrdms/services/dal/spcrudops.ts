import { IApsrdmsProps } from '../../components/IApsrdmsProps';
import { spfi, SPFx, Web } from "@pnp/sp/presets/all";
// import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";

export interface ISPCRUDOPS {
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
    uploadFile(folderServerRelativeUrl: string, file: File, props: IApsrdmsProps): Promise<any>;
    createFolder(libraryName: string, folderName: string, props: IApsrdmsProps): Promise<any>;
    deleteFile(fileServerRelativeUrl: string, props: IApsrdmsProps): Promise<any>;
    currentProfile(props: IApsrdmsProps): Promise<any>;
    currentUser(props: IApsrdmsProps): Promise<any>;
    currentUserGroups(props: IApsrdmsProps): Promise<any>;
    parentCurrentUserGroups(props: IApsrdmsProps): Promise<any>;
    getSiteUsers(props: IApsrdmsProps): Promise<any>;
    // getAllItemsRecursively(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
    //     , orderby: { column: string, isAscending: boolean }, items: any[], startItemId?: number, itemCount?: number, props?: IApsrdmsProps): Promise<any>;
    // getContentType(libraryName: string, props: IApsrdmsProps): Promise<any>;
    // uploadContentTypeFile(fileName: string, ContentTypeId: string, templateFileUrl: string, folderServerRelativeUrl: string, props: IApsrdmsProps): Promise<any>;
    // getBatchData(listDetails: any[], props: IApsrdmsProps): Promise<any>;
    getFolderContent(folderServerRelativeUrl: string, props: IApsrdmsProps): Promise<any>;
    createDocumentLibrary(libraryName: string, props: IApsrdmsProps): Promise<any>;
    getAllCustomLibrary(columnsToRetrieve: string, filters: string, props: IApsrdmsProps): Promise<any>;
    // addColumnsLibrary(columns: any, libraryName: string, props: IApsrdmsProps): Promise<any>;

    // getLibraryFileAsArrayBuffer(folderServerRelativeUrl: string, props: IApsrdmsProps): Promise<any>;

}

export default async function SPCRUDOPS(): Promise<ISPCRUDOPS> {
    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string, isAscending: boolean }, props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        const items: any[] = await web.lists.getByTitle(listName).items.select(columnsToRetrieve).expand(columnsToExpand).filter(filters).orderBy(orderby.column, orderby.isAscending).top(5000)();
        return items;
    };

    const getTopData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string, isAscending: boolean }, top: number, props: IApsrdmsProps) => {
        //let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const sp = spfi().using(SPFx(props.context));
        const items: any[] = await sp.web.lists.getByTitle(listName).items.select(columnsToRetrieve).expand(columnsToExpand).filter(filters).orderBy(orderby.column, orderby.isAscending).top(top)();
        return items;
    };


    const getDataAnotherSiteCollection = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string, isAscending: boolean }, props: IApsrdmsProps) => {
        let web = Web(window.location.protocol + "//" + window.location.host);
        const list: any = await web.lists.getByTitle(listName).items.select(columnsToRetrieve).expand(columnsToExpand).filter(filters).orderBy(orderby.column, orderby.isAscending);
        const items: any = await list.items.getAll();
        return items;
    };

    const insertData = async (listName: string, data: any, props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.add(data).then(result => {
            return result;
        });
    };

    const updateData = async (listName: string, itemId: number, data: any, props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).update(data).then(result => {
            return result;
        });
    };

    const deleteData = async (listName: string, itemId: number, props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).delete().then(result => {
            return result;
        });
    };

    const getListInfo = async (listName: string, props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        const list = await web.lists.getByTitle(listName);
        const listInfo = await list.select("Id,Title")();

        return listInfo;
    };

    const getListData = async (listName: string, columnsToRetrieve: string, props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        const list = await web.lists.getByTitle(listName).items.select(columnsToRetrieve);
        //const listInfo = await list.select("Id,Title")();

        return list;
    };

    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: IApsrdmsProps) => {
        Logger.subscribe(ConsoleListener());
        Logger.activeLogLevel = LogLevel.Verbose;
    
        const sp = spfi().using(SPFx(props.context)); // Proper SPFx context initialization
        const ticks = ((new Date().getTime() * 10000) + 621355968000000000);
        const fileName = `${ticks}_${file.name}`;
    
        try {
            const folder = await sp.web.getFolderByServerRelativePath(folderServerRelativeUrl);
            const uploadedFile = await folder.files.addUsingPath(fileName, file, { Overwrite: true });
    
            Logger.log({ data: uploadedFile, level: LogLevel.Verbose, message: "File uploaded successfully" });
            return uploadedFile;
        } catch (error) {
            Logger.log({ level: LogLevel.Error, message: `Error uploading file: ${error}` });
            throw error;
        }
    };

    const createFolder = async (libraryName: string, folderName: string, props: IApsrdmsProps) => {
        try {
            const sp = spfi().using(SPFx(props.context));
            const folder = await sp.web.getFolderByServerRelativePath(`/${libraryName}`).addSubFolderUsingPath(folderName);
            console.log("Folder created:", folder);
            return folder;
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };
    const deleteFile = async (fileServerRelativeUrl: string, props: IApsrdmsProps) => {
        Logger.subscribe(ConsoleListener());
        Logger.activeLogLevel = LogLevel.Verbose;

        let web = Web(props.context.pageContext.web.absoluteUrl);

        return await web.getFolderByServerRelativePath(fileServerRelativeUrl).delete().then(result => {
            return result;
        });
    };

    const currentProfile = async (props: IApsrdmsProps) => {
        const sp = spfi().using(SPFx(props.context));

        return await sp.profiles.myProperties().then((response: any) => {
            //return await sp.web.currentUser.get().then((response)=>{
            console.log(response);
            return response;
        })
    };

    const currentUser = async (props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        return await web.currentUser().then((response) => {
            //return await sp.web.currentUser.get().then((response)=>{
            console.log(response);
            return response;
        })
    };

    const parentCurrentUserGroups = async (props: IApsrdmsProps) => {
        let web = Web(window.location.protocol + "//" + window.location.host);
        return await web.currentUser.groups().then((response) => {
            console.log(response);
            return response;
        })
    };

    const currentUserGroups = async (props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        return await web.currentUser.groups().then((response) => {
            console.log(response);
            return response;
        })
    };

    const getSiteUsers = async (props: IApsrdmsProps) => {
        let web = Web(props.context.pageContext.web.absoluteUrl);
        return await web.siteUsers().then((response) => {
            console.log(response);
            return response;
        })
    };
    const getFolderContent = async (folderServerRelativeUrl: string, props: IApsrdmsProps) => {
        let web = await Web(props.context.pageContext.web.absoluteUrl);
        const result: any = await web.getFolderByServerRelativePath(folderServerRelativeUrl);
        const files = await result.files.select("ID, Name, ServerRelativeUrl,File_x0020_Type, Modified, ListItemAllFields/ID").expand("ListItemAllFields").get();
        return files;
    };
    const createDocumentLibrary = async (libraryName: string, props: IApsrdmsProps) => {
        try {
            const sp = spfi().using(SPFx(props.context));
            const list = await sp.web.lists.add(libraryName, "Custom Library", 101, false); // 101 = Document Library
            console.log("Document Library Created:", list);
            return list;
        } catch (error) {
            console.error("Error creating library:", error);
        }
    };
    const getAllCustomLibrary = async (columnsToRetrieve: string, filters: string, props: IApsrdmsProps) => {
        try {
            const sp = spfi().using(SPFx(props.context));
            const folder = await sp.web.lists.select(columnsToRetrieve).filter(filters)();
            console.log("All Libraries collection:", folder);
            return folder;
        } catch (error) {
            console.error("Error All Libraries collection:", error);
        }
    };
    // const addColumnsLibrary = async (columns:any, libraryName: string, props: IApsrdmsProps) => {
    //     try {
    //         const sp = spfi().using(SPFx(props.context));
    //         const list = sp.web.lists.getByTitle(libraryName);
    //         for (let n = 0; n < columns.length; n++) {
    //         await list.fields.${columns.type}(columns.name, { Required: false });
    //         }
    //         await list.fields.addDateTime("DueDate", { Required: false });
    
    //         console.log("Columns added successfully");
    //     } catch (error) {
    //         console.error("Error adding columns:", error);
    //     }
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
        uploadFile,
        createFolder,
        deleteFile,
        currentProfile,
        currentUser,
        parentCurrentUserGroups,
        currentUserGroups,
        getSiteUsers,
        getFolderContent,
        createDocumentLibrary,
        getAllCustomLibrary
    };
}