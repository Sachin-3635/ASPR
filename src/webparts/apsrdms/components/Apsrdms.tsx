
// require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
// import * as React from 'react';
// import styles from './Apsrdms.module.scss';
// import type { IApsrdmsProps } from './IApsrdmsProps';

// import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// import { ASPRDMSHome } from '../components/Homepage/ASPRHome';

// import { spfi, SPFx } from "@pnp/sp";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists/web";
// import { setupSP } from '../services/dal/pnpget';

// interface IDmsModuleState {
//   defaultLibraryTitle: string | null;
// }

// export default class DmsModule extends React.Component<IApsrdmsProps, IDmsModuleState> {
//   constructor(props: IApsrdmsProps) {
//     super(props);
//     this.state = {
//       defaultLibraryTitle: null,
//     };
//   }

//   public async componentDidMount() {
//     const sp = spfi().using(SPFx(this.props.context));
//     setupSP(this.props.context);

//     try {
//       const lists = await sp.web.lists
//         .select("Title", "BaseTemplate")
//         .filter("BaseTemplate eq 101")(); // 101 = Document Library

//       if (lists.length > 0) {
//         this.setState({ defaultLibraryTitle: lists[0].Title });
//       }
//     } catch (error) {
//       console.error("Error fetching libraries:", error);
//     }
//   }

//   public render(): React.ReactElement<IApsrdmsProps> {
//     const { defaultLibraryTitle } = this.state;

//     return (
//       <section className={styles.welcome}>
//         <div>
//           <HashRouter>
//             <Routes>
//               {/* If no path, redirect to the first library */}
//               {defaultLibraryTitle && (
//                 <Route
//                   path="/"
//                   element={<Navigate to={`/library/${defaultLibraryTitle}`} replace />}
//                 />
//               )}

//               <Route path="/library/:libraryName"
//                 element={<ASPRDMSHome context={this.props.context} 
//                     currentSPContext={this.props.context}   // 👈 pass same SPFx context
//                   />
//                 }
//               />
//             </Routes>
//           </HashRouter>
//         </div>
//       </section>
//     );
//   }
// }



require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
import * as React from 'react';
import styles from './Apsrdms.module.scss';
import type { IApsrdmsProps } from './IApsrdmsProps';

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ASPRDMSHome } from '../components/Homepage/ASPRHome';
import RequestPage from '../components/Request/RequestPage';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { setupSP } from '../services/dal/pnpget';

interface IDmsModuleState {
  defaultLibraryTitle: string | null;
}

export default class DmsModule extends React.Component<IApsrdmsProps, IDmsModuleState> {
  constructor(props: IApsrdmsProps) {
    super(props);
    this.state = {
      defaultLibraryTitle: null,
    };
  }

  public async componentDidMount() {
    const sp = spfi().using(SPFx(this.props.context));
    setupSP(this.props.context);

    // Libraries to exclude from showing up in default route
    const excludeLibraries = [
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
      "Banner", // 👈 exclude Banner
      "MicroFeed"
    ];

    try {
      const lists = await sp.web.lists
        .select("Title", "BaseTemplate")
        .filter("BaseTemplate eq 101 and Hidden eq false")(); // 101 = Document Library

      // Pick first non-excluded library
      const firstValidLib = lists.find(l => !excludeLibraries.includes(l.Title));

      if (firstValidLib) {
        this.setState({ defaultLibraryTitle: firstValidLib.Title });
      }
    } catch (error) {
      console.error("Error fetching libraries:", error);
    }
  }

  public render(): React.ReactElement<IApsrdmsProps> {
    const { defaultLibraryTitle } = this.state;

    return (
      <section className={styles.welcome}>
        <div>
          <HashRouter>
            <Routes>
              {/* If no path, redirect to the first valid library */}
              {defaultLibraryTitle && (
                <Route
                  path="/"
                  element={<Navigate to={`/library/${defaultLibraryTitle}`} replace />}
                />
              )}

              <Route
                path="/library/:libraryName"
                element={
                  <ASPRDMSHome
                    context={this.props.context}
                    currentSPContext={this.props.context} // pass same SPFx context
                  />
                }
              />
              <Route path="/Request" element={<RequestPage {...this.props} />} />
            </Routes>
          </HashRouter>
        </div>
      </section>
    );
  }
}
