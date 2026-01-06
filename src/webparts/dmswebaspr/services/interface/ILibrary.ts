export interface ILibrary
{
  TranslatedTitle?: string;
  Id?: string;
  Title?: string;
  RootFolder?: {
    ServerRelativeUrl?: string;
  };
}