// export interface IApsrdmsSolutionProps {
//   description: string;
//   isDarkTheme: boolean;
//   environmentMessage: string;
//   hasTeamsContext: boolean;
//   userDisplayName: string;
// }


import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface IApsrdmsSolutionProps {
  description?: string;
  isDarkTheme?: boolean;
  environmentMessage?: string;
  hasTeamsContext?: boolean;
  userDisplayName?: string;
  context?: WebPartContext;
  // currentSPContext?: WebPartContext;
  // currentSPContext: any;
  currentSPContext: WebPartContext;
  sharedData?: any;
}