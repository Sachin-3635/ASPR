import * as React from 'react';
import type { IApsrdmsProps } from '../IApsrdmsProps';
import { TextField, DefaultButton, Dropdown, IDropdownOption } from '@fluentui/react'
import { Label } from '@fluentui/react/lib/Label';
import { PeoplePicker, PrincipalType, IPeoplePickerContext } from '@pnp/spfx-controls-react/lib/PeoplePicker';
// import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { spfi, SPFx } from "@pnp/sp/presets/all";
import { Formik, FormikProps } from 'formik';
import useSPCRUD from '../../services/dal/spcrudops';
import * as yup from 'yup';

import "@pnp/sp/folders";
import { Link } from 'react-router-dom';
import exit from '../../assets/img/exit.png';

export default class RequestPage extends React.Component<IApsrdmsProps, any> {
    private _sp: any;
    private peoplePickerContext: IPeoplePickerContext;
    // export const RequestPage: React.Component<IApsrdmsProps> = (props: IApsrdmsProps) => {
    constructor(props: any) {
        super(props);
        this._sp = spfi().using(SPFx(props.context));
        this.peoplePickerContext = {
            absoluteUrl: this.props.context.pageContext.web.absoluteUrl,
            msGraphClientFactory: this.props.context.msGraphClientFactory as any,
            spHttpClient: this.props.context.spHttpClient as any
        };
        this.state = {
            peoplePickerKey: Date.now(),
            RepoOwnerAccessColl: [],
            RepoEditAccessColl: [],
            RepoViewAccessColl: [],
            AllUserAccessColl: [],
            FolderEditAccessColl: [],
            FolderViewAccessColl: [],
            AllLibraries: [],
            items: [
                {
                    id: 1,
                    ChildFolderName: '',
                    EditUsers: [],
                    ViewUsers: []
                }
            ],
            RepoName: ''
        }
    }

    public async componentDidMount(): Promise<void> {
        const options = await this.getCustomLibraryDropdownOptions();
        this.setState({ libraryOptions: options });
    }

    private async getCustomLibraryDropdownOptions(): Promise<IDropdownOption[]> {
        // (Use the function defined above)
        try {
            const spCrudObj = await useSPCRUD();
            await spCrudObj.getAllCustomLibrary("Title, BaseTemplate, Hidden", "BaseTemplate eq 101 and Hidden eq false", this.props).then((result) => {
                const options: IDropdownOption[] = result.map(lib => ({
                    key: lib.Title,
                    text: lib.Title
                }));
                options.push({ key: "Create New Repository", text: "Create New Repository" })
                this.setState({ AllLibraries: options });
            })



            //   return options;
        } catch (err) {
            console.error("Error retrieving libraries:", err);
            return [];
        }
    }

    public getFieldProps(formik: FormikProps<any>, field: string) {
        return { ...formik.getFieldProps(field), errorMessage: formik.errors[field] as string };
    }
    public async onRequestInitiate(formValue: any) {
        const libraryName = formValue.RepositoryName;
        const spCrudObj = await useSPCRUD();
        await spCrudObj.createDocumentLibrary(libraryName, this.props).then(async (result) => {
            this.setState({ RepoName: libraryName });
            const list = this._sp.web.lists.getByTitle(libraryName);
            await this.breakInheritance(libraryName, this.props.context, list);
            await this.assignPermissions(libraryName, "user@example.com", "Contribute", this.props.context, list);
        })
    }
    public createDocumentLibrary = async (libraryName: string, context: any) => {
        try {
            //const sp = spfi().using(SPFx(context));
            const list = await this._sp.web.lists.add(libraryName, "Custom Library", 101, false); // 101 = Document Library
            console.log("Document Library Created:", list);
            return list;
        } catch (error) {
            console.error("Error creating library:", error);
        }
    };

    public assignPermissions = async (libraryName: string, userEmail: string, roleName: string, context: any, library: any) => {
        try {
            let objectsArray = [...this.state.RepoOwnerAccessColl, ...this.state.RepoEditAccessColl, ...this.state.RepoViewAccessColl]
            const uniqueObjects = Array.from(
                new Map(objectsArray.map((item) => [item.Name, item])).values()
            );
            const library = this._sp.web.lists.getByTitle(libraryName);
            if (uniqueObjects.length > 0) {
                void uniqueObjects.map(async (itm) => {
                    const roleDefinition = await this._sp.web.roleDefinitions.getByName(itm.Name)();
                    void objectsArray.filter(user => user.Name === itm.Name)
                        .map(async (item: any) => {
                            await library.roleAssignments.add(item.Id, roleDefinition.Id);
                        });
                });
            }
            console.log(`Permissions assigned: ${roleName} to ${userEmail}`);
        } catch (error) {
            console.error("Error assigning permissions:", error);
        }
    };
    public breakInheritance = async (libraryName: string, context: any, library: any) => {
        try {
            //const sp = spfi().using(SPFx(context));
            //const library = this._sp.web.lists.getByTitle(libraryName);

            await library.breakRoleInheritance(true); // true = Copy existing permissions
            const roleAssignments = await library.roleAssignments();
            for (const assignment of roleAssignments) {
                if (assignment?.PrincipalId !== 3)
                    await library.roleAssignments.getById(assignment.PrincipalId).delete();
            }
            console.log("Inheritance broken. Now you can assign custom permissions.");
        } catch (error) {
            console.error("Error breaking inheritance:", error);
        }
    };
    public addLibraryMetadata = async (libraryName: string, context: any, library: any, formValue: any) => {
        try {
            // const library = this._sp.web.lists.getByTitle(libraryName);
            // const itemAddResult = await list.items.add({
            //     Title: "Initial Item", // Required Title field for lists
            //     Location: formValue.Location, // Custom metadata value for ProjectName column
            //     Department: formValue.Department // Custom metadata value for DueDate column (ISO format)
            // });
            // console.log("Added item with metadata:", itemAddResult);

            // Option 2: If files or items already exist in the library, update their metadata.
            const items = await library.items.get();
            await Promise.all(
                items.map(item =>
                    library.items.getById(item.Id).update({
                        Location: formValue.Location,
                        Department: formValue.Department
                    })
                )
            );
            // console.log("Updated existing items with metadata");
        } catch (error) {
            console.error("Error adding metadata values to library:", error);
        }
    };
    public _getPeoplePickerItems(items: any[], Param: any) {
        if (Param == "DocumentOwner") {
            let OwnerColl = [];
            if (items.length > 0) {
                items.map((itm) => {
                    OwnerColl.push({ 'Name': "DocumentOwner", Id: itm.id })
                });
                this.setState({ RepoOwnerAccessColl: OwnerColl });
            }
            else {
                this.setState({ RepoOwnerAccessColl: [] });
            }
        }
        else if (Param == "DocumentEditors") {
            let EditColl = [];
            if (items.length > 0) {
                items.map((itm) => {
                    EditColl.push({ 'Name': "DocumentEditors", Id: itm.id })
                });
                this.setState({ RepoEditAccessColl: EditColl });
            }
            else {
                this.setState({ RepoEditAccessColl: [] });
            }
        }
        else if (Param == "DocumentView") {
            let ViewColl = [];
            if (items.length > 0) {
                items.map((itm) => {
                    ViewColl.push({ 'Name': "DocumentView", Id: itm.id })
                });
                this.setState({ RepoViewAccessColl: ViewColl });
            }
            else {
                this.setState({ RepoViewAccessColl: [] });
            }
        }
        else if (Param == "ChildEdit") {
            let EditColl = [];
            if (items.length > 0) {
                items.map((itm) => {
                    EditColl.push({ 'Name': "DocumentEditors", Id: itm.id })
                });
                this.setState({ FolderEditAccessColl: EditColl });
            }
            else {
                this.setState({ FolderEditAccessColl: [] });
            }
        }
        else if (Param == "ChildView") {
            let ViewColl = [];
            if (items.length > 0) {
                items.map((itm) => {
                    ViewColl.push({ 'Name': "DocumentView", Id: itm.id })
                });
                this.setState({ FolderViewAccessColl: ViewColl });
            }
            else {
                this.setState({ FolderViewAccessColl: [] });
            }
        }

    }

    public onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        this.setState({ RepoName: item.key })
    };


    public render(): React.ReactElement<any> {
        const initialValues = {
            RepositoryName: '',
            Location: '',
            Department: '',
            DocumentOwner: [],
            DocumentEditors: [],
            DocumentView: [],
            ChildFolderName: '',
            SubmitClick: false,

        }
        const validate = yup.object().shape({
            //RepositoryName: yup.string().required('Repository Name is required'),
            RepositoryName: yup.string().test(
                "RepositoryName",
                "Repository Name is required",
                (custCode) => {
                    if (this.state.RepoName === "Create New Repository") {
                        return !!custCode;
                    }
                    return true;
                }
            ),
        })
        return (
            <div>
                <Formik
                    initialValues={initialValues}
                    onSubmit={async values => {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        alert(JSON.stringify(values, null, 2));

                    }}
                    validationSchema={validate}
                >
                    {formik => (
                        <div className='container MainRequestForm' style={{ margin: "20px auto" }}>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='Main-Boxpoup'>
                                        <div className="bordered">
                                            <h1>Create Repository Folder</h1>
                                        </div>
                                        <div className='borderedbox'>
                                            <div className='row mb-20'>
                                                <div className='col-md-4'>
                                                    <Label>Repository Name</Label>
                                                    <TextField
                                                        type='text'
                                                        {...this.getFieldProps(formik, 'RepositoryName')}
                                                        onChange={async (e: any) => {
                                                            formik.setFieldValue("RepositoryName", e.currentTarget.value)
                                                                .catch((error) => console.error("Error setting field value:", error));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row mb-20'>
                                                <div className='col-md-4'>
                                                    <Label>Owner Access Users</Label>
                                                    <PeoplePicker
                                                        key={this.state.pickerKey}
                                                        context={this.peoplePickerContext}
                                                        personSelectionLimit={10}
                                                        tooltipDirectional={1}
                                                        onChange={(items: any) => {
                                                            this._getPeoplePickerItems(items, "DocumentOwner");
                                                            formik.setFieldValue("DocumentOwner", items);
                                                        }}
                                                        principalTypes={[PrincipalType.User]}
                                                        ensureUser={true}
                                                        resolveDelay={1000}
                                                        placeholder='Enter names or email addresses...'
                                                    />
                                                </div>
                                                <div className='col-md-4'>
                                                    <Label>Edit Access Users</Label>
                                                    <PeoplePicker
                                                        key={this.state.pickerKey}
                                                        context={this.peoplePickerContext}
                                                        personSelectionLimit={10}
                                                        showtooltip={true}
                                                        onChange={(items: any) => {
                                                            this._getPeoplePickerItems(items, "DocumentEditors");
                                                            formik.setFieldValue("DocumentEditors", items);
                                                        }}
                                                        required={true}
                                                        principalTypes={[PrincipalType.User]}
                                                        ensureUser={true}
                                                        resolveDelay={1000}
                                                        placeholder='Enter names or email addresses...'
                                                    />
                                                </div>
                                                <div className='col-md-4'>
                                                    <Label>View Access Users</Label>
                                                    <PeoplePicker
                                                        key={this.state.pickerKey}
                                                        context={this.peoplePickerContext}
                                                        personSelectionLimit={10}
                                                        tooltipDirectional={1}
                                                        onChange={(items: any) => {
                                                            this._getPeoplePickerItems(items, "DocumentView");
                                                            formik.setFieldValue("DocumentView", items);
                                                        }}
                                                        principalTypes={[PrincipalType.User]}
                                                        ensureUser={true}
                                                        resolveDelay={1000}
                                                        placeholder='Enter names or email addresses...'
                                                    />
                                                </div>
                                            </div>
                                            <div className='row mb-20'>
                                                <div className='col-md-12'>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                                        <DefaultButton
                                                            type='submit'
                                                            disabled={formik.values.SubmitClick}
                                                            text="Submit"
                                                            className='btn-primary'
                                                            onClick={async () => {
                                                                await formik.validateForm().then(async (frmResult) => {
                                                                    if (formik.isValid) {
                                                                        await formik.setFieldValue("SubmitClick", true);
                                                                        await this.onRequestInitiate(formik.values);

                                                                        // Reset the form and picker
                                                                        formik.resetForm();
                                                                        this.setState({ pickerKey: Date.now() });
                                                                    }
                                                                });
                                                            }}
                                                            iconProps={{ iconName: 'SaveAs' }}
                                                        />

                                                        <DefaultButton
                                                            text="Reset"
                                                            className='btn-default'
                                                            iconProps={{ iconName: 'Refresh' }}
                                                            onClick={() => {
                                                                formik.resetForm();
                                                                this.setState({ pickerKey: Date.now() });
                                                            }}
                                                        />

                                                        {/* <Link to="/" className='btn-danger'>
                                                            <img src={exit} width="22px" height="18px"/>
                                                            Exit
                                                        </Link> */}

                                                        <Link to="/">
                                                            <DefaultButton
                                                                text="Exit"
                                                                className="btn-danger"
                                                                iconProps={{ iconName: "NavigateBack" }}
                                                            />
                                                        </Link>

                                                        {/* <DefaultButton
                                                        text="Exit"
                                                        className='btn-danger'
                                                        iconProps={{ iconName: 'NavigateBack' }}
                                                        onClick={() => {
                                                            window.location.href = '/Library';
                                                        }}
                                                    /> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    )}
                </Formik>
            </div>
        )
    }

}