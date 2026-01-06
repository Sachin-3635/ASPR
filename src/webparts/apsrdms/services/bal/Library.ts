// import { IApsrdmsProps } from '../../apsrdms/components/IApsrdmsProps';
// import { ILibrary } from '../interface/ILibrary';
// import { spfi, SPFx } from "@pnp/sp";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";

// export interface ILibraryOps {
//   getAllLibraries(props: IApsrdmsProps): Promise<ILibrary[]>;
// }

// export default function LibraryOps(): ILibraryOps {
//   const getAllLibraries = async (props: IApsrdmsProps): Promise<ILibrary[]> => {
//     const sp = spfi().using(SPFx(props.context));

//     // List of known default document libraries to exclude
//     const defaultLibraryTitles = [
//       "Documents",
//       "Form Templates",
//       "Site Assets",
//       "Site Pages",
//       "Style Library",
//       "Images",
//       "Site Collection Documents",
//       "Site Collection Images",
//       "Customized Reports",
//       "Pages",
//       "MicroFeed"
//     ];

//     try {
//       const results = await sp.web.lists
//         .filter("BaseTemplate eq 101 and Hidden eq false")
//         .select("Id", "Title", "RootFolder/ServerRelativeUrl")
//         .expand("RootFolder")();

//       const libraries: ILibrary[] = results
//         .filter((item: any) => !defaultLibraryTitles.includes(item.Title))
//         .map((item: any) => ({
//           Id: item.Id,
//           Title: item.Title,
//           RootFolder: {
//             ServerRelativeUrl: item.RootFolder?.ServerRelativeUrl ?? ''
//           }
//         }));

//       return libraries;
//     } catch (error) {
//       console.error("Error fetching libraries:", error);
//       return [];
//     }
//   };

//   return {
//     getAllLibraries
//   };
// }








import { IApsrdmsProps } from "../../components/IApsrdmsProps";
import { ILibrary } from "../interface/ILibrary";
import { spfi, SPFx } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

export interface ILibraryOps {
  getAllLibraries(props: IApsrdmsProps): Promise<ILibrary[]>;
}

export default function LibraryOps(): ILibraryOps {
  const getAllLibraries = async (props: IApsrdmsProps): Promise<ILibrary[]> => {
    const sp = spfi().using(SPFx(props.context));

    // Default libraries to exclude
    const defaultLibraryTitles = [
      "Documents",
      "Form Templates",
      "Site Assets",
      "Site Pages",
      "Style Library",
      "Images",
      "Site Collection Documents",
      "Site Collection Images",
      "Customized Reports",
      "Pages",
      "Banner",
      "MicroFeed"
    ];

    try {
      const results = await sp.web.lists
        .filter("BaseTemplate eq 101 and Hidden eq false")
        .select("Id", "Title", "RootFolder/ServerRelativeUrl")
        .expand("RootFolder")();

      const libraries: ILibrary[] = results
        .filter((item: any) => !defaultLibraryTitles.includes(item.Title))
        .map((item: any) => ({
          Id: item.Id,
          Title: item.Title,
          RootFolder: {
            ServerRelativeUrl: item.RootFolder?.ServerRelativeUrl ?? ""
          }
        }));

      return libraries;
    } catch (error) {
      console.error("Error fetching libraries:", error);
      return [];
    }
  };

  return {
    getAllLibraries
  };
}
