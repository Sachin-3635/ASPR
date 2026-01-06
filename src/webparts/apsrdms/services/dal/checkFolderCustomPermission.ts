// import { PermissionKind } from "@pnp/sp/security";
// import { getSPInstance } from '../dal/pnpget';

// export const checkFolderCustomPermission = async (
//   serverRelativeFolderUrl: string,
//   libraryName: string
// ): Promise<"DocumentOwner" | "DocumentEditors" | "DocumentView" | null> => {
//   try {
//     const sp = getSPInstance();
//     const currentUser = await sp.web.currentUser();

//     // Skip check on root folder
//     const folderUrlNormalized = serverRelativeFolderUrl.toLowerCase().replace(/\/$/, "");
//     const libraryNameNormalized = libraryName.toLowerCase().replace(/\/$/, "");

//     if (folderUrlNormalized.endsWith("/" + libraryNameNormalized)) {
//       console.warn("Skipping root folder permission check:", folderUrlNormalized);
//       return "DocumentOwner"; // or fallback to library-level check
//     }

//     const folder = sp.web.getFolderByServerRelativePath(serverRelativeFolderUrl);

  
//     let itemId: number | null = null;
//     let listId: string | null = null;

//     try {
//       const itemFields = await folder.listItemAllFields();
//       itemId = itemFields?.Id || null;
//       listId = itemFields?.ParentList?.Id || null;
//     } catch (e) {
//       console.warn("Fallback to get item by folder path:", serverRelativeFolderUrl);
//     }

//     // Fallback: Try to get item ID via list + folder path
//     if (!itemId || !listId) {
//       try {
//         const folderParts = serverRelativeFolderUrl.split('/');
//         const folderName = folderParts[folderParts.length - 1];
//         const sp = getSPInstance();

//         // Get list by title
//         const list = sp.web.lists.getByTitle(libraryName);
//         const folderItems = await list.items
//           .filter(`FileLeafRef eq '${folderName}'`)
//           .top(1)()

//         if (folderItems.length > 0) {
//           itemId = folderItems[0].Id;
//           const listMeta = await list.select("Id")();
//           listId = listMeta.Id;
//         }
//       } catch (fallbackErr) {
//         console.error("Fallback permission fetch failed:", fallbackErr);
//         return null;
//       }
//     }

//     const perms = await sp.web.lists
//       .getById(listId)
//       .items.getById(itemId)
//       .getUserEffectivePermissions(currentUser.LoginName);

//     const hasFullControl = sp.web.hasPermissions(perms, PermissionKind.FullMask);
//     const canManage = sp.web.hasPermissions(perms, PermissionKind.ManagePermissions);
//     const canEdit = sp.web.hasPermissions(perms, PermissionKind.EditListItems);
//     const canAdd = sp.web.hasPermissions(perms, PermissionKind.AddListItems);
//     const canView = sp.web.hasPermissions(perms, PermissionKind.ViewListItems);

//     if (hasFullControl || canManage) return "DocumentOwner";
//     if (canEdit || canAdd) return "DocumentEditors";
//     if (canView) return "DocumentView";

//     return null;
//   } catch (error) {
//     console.error("Permission check failed for folder:", serverRelativeFolderUrl, error);
//     return null;
//   }
// };





import { PermissionKind } from "@pnp/sp/security";
import { getSPInstance } from '../dal/pnpget';

export const checkFolderCustomPermission = async (
  serverRelativeFolderUrl: string,
  libraryName: string
): Promise<"DocumentOwner" | "DocumentEditors" | "DocumentView" | null> => {
  try {
    const sp = getSPInstance();
    const currentUser = await sp.web.currentUser();

    // Normalize and skip root folder
    const folderUrlNormalized = serverRelativeFolderUrl.toLowerCase().replace(/\/$/, "");
    const libraryNameNormalized = libraryName.toLowerCase().replace(/\/$/, "");
    if (folderUrlNormalized.endsWith("/" + libraryNameNormalized)) {
      console.warn("Skipping root folder permission check:", folderUrlNormalized);
      return "DocumentOwner";
    }

    const folder = sp.web.getFolderByServerRelativePath(serverRelativeFolderUrl);

    let itemId: number | null = null;
    let listId: string | null = null;

    // First try: folder.listItemAllFields
    try {
      const itemFields = await folder.listItemAllFields();
      itemId = itemFields?.Id || null;
      listId = itemFields?.ParentList?.Id || null;
    } catch (e) {
      console.warn("Primary item field fetch failed, using fallback.");
    }

    // Fallback: query list by folder name
    if (!itemId || !listId) {
      try {
        const folderParts = serverRelativeFolderUrl.split('/');
        const folderName = folderParts[folderParts.length - 1];
        const list = sp.web.lists.getByTitle(libraryName);

        const folderItems = await list.items
          .filter(`FileLeafRef eq '${folderName}'`)
          .top(1)();

        if (folderItems.length > 0) {
          itemId = folderItems[0].Id;
          const listMeta = await list.select("Id")();
          listId = listMeta.Id;
        }
      } catch (fallbackErr) {
        console.error("Fallback permission fetch failed:", fallbackErr);
        return null;
      }
    }

    if (!itemId || !listId) {
      console.warn("Could not resolve itemId/listId even after fallback.");
      return null;
    }

    // Get permissions
    const perms = await sp.web.lists
      .getById(listId)
      .items.getById(itemId)
      .getUserEffectivePermissions(currentUser.LoginName);

    const hasPermission = (kind: PermissionKind) =>
      sp.web.lists.getById(listId).items.getById(itemId).hasPermissions(perms, kind);

    // Debug logs
    console.log(`Permissions for user on folder: ${serverRelativeFolderUrl}`);
    console.log("  FullControl:", hasPermission(PermissionKind.FullMask));
    console.log("  ManagePermissions:", hasPermission(PermissionKind.ManagePermissions));
    console.log("  EditListItems:", hasPermission(PermissionKind.EditListItems));
    console.log("  AddListItems:", hasPermission(PermissionKind.AddListItems));
    console.log("  ViewListItems:", hasPermission(PermissionKind.ViewListItems));

    const isOwner =
      hasPermission(PermissionKind.FullMask) ||
      hasPermission(PermissionKind.ManagePermissions);
    const isEditor =
      hasPermission(PermissionKind.EditListItems) ||
      hasPermission(PermissionKind.AddListItems);
    const isViewer = hasPermission(PermissionKind.ViewListItems);

    if (isOwner) return "DocumentOwner";
    if (isEditor) return "DocumentEditors";
    if (isViewer) return "DocumentView";

    return null;
  } catch (error) {
    console.error("Permission check failed for folder:", serverRelativeFolderUrl, error);
    return null;
  }
};
