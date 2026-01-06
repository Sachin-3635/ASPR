export interface ILibrary
{
  Id: string;
  Title: string;
  RootFolder: {
    ServerRelativeUrl: string;
  };
}