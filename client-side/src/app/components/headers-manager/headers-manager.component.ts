import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { first, Subscription, firstValueFrom } from 'rxjs';
import { DIMXService } from "../../services/dimx.service";
import { PepAddonService, PepLayoutService, PepScreenSizeType, PepUtilitiesService } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListDataSource, IPepGenericListPager, IPepGenericListActions, IPepGenericListInitData, PepGenericListService } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { DataViewFieldType, GridDataViewField, MenuDataView, Page } from '@pepperi-addons/papi-sdk';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { NavigationService } from "../../services/navigation.service";
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { PepAddonBlockLoaderService } from "@pepperi-addons/ngx-lib/remote-loader";
import { coerceNumberProperty } from "@angular/cdk/coercion";

import { IPepProfileDataViewsCard, IPepProfile, IPepProfileDataViewClickEvent, IPepProfileDataView } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { HeaderTemplateRowProjection } from "../application-header.model";
import { AppHeadersService } from "../../services/headers.service";
import { IPepMenuItemClickEvent } from "@pepperi-addons/ngx-lib/menu";
import { PepDIMXHelperService } from "@pepperi-addons/ngx-composite-lib";
import { MatTabChangeEvent } from "@angular/material/tabs";



@Component({
    selector: 'headers-manager',
    templateUrl: './headers-manager.component.html',
    styleUrls: ['./headers-manager.component.scss'],
    providers: [DIMXService, PepDIMXHelperService]
})
export class HeadersManagerComponent implements OnInit, OnDestroy {
    currentTabIndex: number = 0;
    private readonly IMPORT_KEY = 'import';
    screenSize: PepScreenSizeType;

    dataSource: IPepGenericListDataSource = null;
    //actions: IPepGenericListActions;
    isSyncInstalled = true;
    totalHeaders: number = 0;
    headers: HeaderTemplateRowProjection[];

    private _subscriptions: Subscription[] = [];

     // Mapping tab variables
     //private pagesMap = new Map<string, string>();
    //  private dataViewsMap = new Map<string, MenuDataView>();
    //  defaultProfileId: string = '';
    //  private _allProfiles: ReadonlyArray<IPepProfile> = [];
    //  availableProfiles: Array<IPepProfile> = [];
     
    //  profileDataViewsList: Array<IPepProfileDataViewsCard> = [];
     
    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        private dimxService: DIMXService,
        public layoutService: PepLayoutService,
        private pepAddonService: PepAddonService,
        public translate: TranslateService,
        private _navigationService: NavigationService,        
        private appHeadersService: AppHeadersService,
        private dialog: PepDialogService,
        private utilitiesService: PepUtilitiesService,
        private pepAddonBlockLoader: PepAddonBlockLoaderService,
        private viewContainerRef: ViewContainerRef
    ) {
        

        this.pepAddonService.setShellRouterData({ showSidebar: true, addPadding: true});
        this.dimxService.register(this.viewContainerRef, this.onDIMXProcessDone.bind(this));
        
        this._subscriptions.push(this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        }));
        
        // Get the available profiles
        // this.appHeadersService.profilesChange$.subscribe(profiles => {
        //     this._allProfiles = profiles;

        //     // After the profiles loaded the defaultProfileId is already loaded too.
        //     this.defaultProfileId = this.appHeadersService.defaultProfileId;
        // });

        // Fill the data views.
        // this.appHeadersService.dataViewsMapChange$.subscribe((dataViewsMap: ReadonlyMap<string, MenuDataView>) => {
        //     this.dataViewsMap = new Map<string, MenuDataView>();
        //     this.profileDataViewsList = [];

        //     dataViewsMap.forEach(dv => {
        //         this.createNewProfileDataViewCard(dv);
        //     });

        //     this.availableProfiles = this._allProfiles.filter(p => this.profileDataViewsList.findIndex(pdv => pdv.profileId === p.id) === -1);
        // });
    }

    async ngOnInit() {
        // checking if new sync is installed , if not --> lock the appHeader editor
            this.isSyncInstalled =  await this.appHeadersService.cheakIfSyncInstalled();
         
            const index = coerceNumberProperty(this.activatedRoute.snapshot.queryParamMap.get('tabIndex'), 0);
            this.setCurrentTabIndex(index);  
    }

    onDIMXProcessDone(event:any) {
        const process = event?.ProcessedFiles[0] || undefined;
        // TODO need to remove the export - there is a bug on dimx import
        if((process.Action.toLowerCase() === 'import' || process.Action.toLowerCase() === 'export') && process.Status.toLowerCase() === 'done'){
            this.setDataSource();
        }
    }

    setDataSource() {
        this.dataSource = {
            init: async (params) => {
             
                let options = 'order_by=';
                
                if (params.sorting) {
                    options += `${params.sorting.sortBy} ${params.sorting?.isAsc ? 'ASC' : 'DESC'}`;
                } else {
                    options += 'Name ASC';
                }
                if (params.searchString?.length > 0) {
                     options += `&where=${params.searchString}`;
                }

                // TODO - FIX THE OPTION , need indexed data
                this.headers = await this.appHeadersService.getHeaders(); // encodeURI(options)

                if (params?.searchString) {
                    this.headers = this.headers.filter((header: any) =>  header.Name.toLowerCase().indexOf(params.searchString.toLowerCase()) > -1  );
                }

                this.totalHeaders = this.headers?.length || 0;
                const items = this.headers.map(header => { return header['Data'] });
        
                return {
                    items: items,
                    totalCount: this.totalHeaders,
                    dataView: {
                        Context: {
                            Name: '',
                            Profile: { InternalID: 0 },
                            ScreenSize: 'Landscape'
                        },
                        Type: 'Grid',
                        Title: '',
                        Fields: [
                            this.getRegularReadOnlyColumn('Name', 'Link',),
                            this.getRegularReadOnlyColumn('Description'),
                            this.getRegularReadOnlyColumn('Draft', 'Boolean'),
                            this.getRegularReadOnlyColumn('Published', 'Boolean'),
                        ],
                        Columns: [
                            { Width: 25 },
                            { Width: 45 },
                            { Width: 15 },
                            { Width: 15 },
                        
                        ],
                        FrozenColumnsCount: 0,
                        MinimumColumnWidth: 0
                    }
                } as IPepGenericListInitData;
            }
        }
    }

    actions: IPepGenericListActions = {        
        get: async (data: PepSelectionData) => {
            if (data?.rows.length === 1 ) {
                return [{
                            title: this.translate.instant("HEADERS_MANAGER.ACTION.EDIT"),
                            handler: async (data: PepSelectionData) => {
                                this._navigationService.navigateToHeader(data?.rows[0]);
                            },    
                        },
                        {
                            title: this.translate.instant("HEADERS_MANAGER.ACTION.DUPLICATE"),
                            handler: async (data: PepSelectionData) => {
                                const res = await this.appHeadersService.duplicateHeader(data?.rows[0]);
                                this.setDataSource();
                            },    
                        },
                        {
                            title: this.translate.instant("HEADERS_MANAGER.ACTION.EXPORT"),
                            handler: async (data: PepSelectionData) => {
                                this.dimxService.export(data?.rows[0],'avner');
                            },    
                        },
                        {
                        title: this.translate.instant("HEADERS_MANAGER.ACTION.DELETE"),
                        handler: async (data: PepSelectionData) => {
                            if (data?.rows.length > 0) {
                                this.deleteHeader(data?.rows[0]);
                            }
                        }
                    }
                ]
            } 
            else {
                return [];
            }
        }
    }

    private getRegularReadOnlyColumn(columnId: string, columnType: DataViewFieldType = 'TextBox'): GridDataViewField {
        return {
            FieldID: columnId,
            Type: columnType,
            Title: this.translate.instant(`HEADERS_MANAGER.GRID_HEADER.${columnId.toUpperCase()}`),
            Mandatory: false,
            ReadOnly: true
        }
    }

    onHeaderClicked(event) {
        this._navigationService.navigateToHeader(event.id);
    }

    deleteHeader(headerID: string) {
        const content = this.translate.instant('HEADERS_MANAGER.DELETE_HEADER.MSG');
        const title = this.translate.instant('HEADERS_MANAGER.DELETE_HEADER.TITLE');
        const dataMsg = new PepDialogData({title, actionsType: "cancel-delete", content});

        this.dialog.openDefaultDialog(dataMsg).afterClosed().pipe(first()).subscribe(async (isDeletePressed) => {
            if (isDeletePressed) {
                const res = await this.appHeadersService.deleteHeader(headerID);
                this.setDataSource();
            }
        });
    }

    async onMenuItemClicked(event: IPepMenuItemClickEvent = null) {
        const menuItem = event.source;
        switch(menuItem.key) {
            case this.IMPORT_KEY: {
             this.dimxService.import();
             break;
            }
        }
    }

    // onDataViewEditClicked(event: IPepProfileDataViewClickEvent): void {
    //     // console.log(`edit on ${event.dataViewId} was clicked`);
    //     this.navigateToManageHeadersDataView(event.dataViewId);
    // }

    // onDataViewDeleteClicked(event: IPepProfileDataViewClickEvent): void {
    //     // console.log(`delete on ${event.dataViewId} was clicked`);
        
    //     this.dialog.openDefaultDialog(new PepDialogData({
    //         title: this.translate.instant('MESSAGES.DIALOG_DELETE_TITLE'),
    //         content: this.translate.instant('MESSAGES.DELETE_DIALOG_CONTENT'),
    //         actionsType: 'cancel-delete'
    //     })).afterClosed().subscribe(isDeleteClicked => {
    //         if (isDeleteClicked) {
    //             const dataView = this.dataViewsMap.get(event.dataViewId);
    //             if (dataView) {
    //                 this.appHeadersService.deleteHeadersDataView(dataView).then(res => {
    //                     this.dialog.openDefaultDialog(new PepDialogData({
    //                         title: this.translate.instant('MESSAGES.DIALOG_INFO_TITLE'),
    //                         content: this.translate.instant('MESSAGES.OPERATION_SUCCESS_CONTENT')
    //                     }));
    //                 });
    //             }
    //         }
    //     });
    // }

    // onSaveNewProfileClicked(event: string): void {
    //     // console.log(`save new profile was clicked for id - ${event} `);
    //     const profileId: number = coerceNumberProperty(event);
    //     if (profileId > 0) {
    //         this.appHeadersService.createNewHeadersDataView(profileId);
    //     }
    // }



    // private createNewProfileDataViewCard(dataView: MenuDataView) {
    //     this.dataViewsMap.set(dataView.InternalID.toString(), dataView);

    //     const profileDataView: IPepProfileDataViewsCard = {
    //         title: dataView.Context?.Profile?.Name, // dataView.Title,
    //         profileId: dataView.Context?.Profile?.InternalID.toString(),
    //         dataViews: [{
    //             dataViewId: dataView.InternalID.toString(),
    //             viewType: dataView.Context?.ScreenSize,
    //             fields: dataView.Fields?.map(field => {
    //                 return `${field.Title} - ${field.FieldID}`;
    //             })
    //         }]
    //     };

    //     this.profileDataViewsList.push(profileDataView);
    // }

    private navigateToManageHeadersDataView(dataViewId: string) {

        this.router.navigate([`tabs/${dataViewId}`], {
            relativeTo: this.activatedRoute,
            queryParamsHandling: 'merge'
        });
    }

    onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.setCurrentTabIndex(tabChangeEvent.index);

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { tabIndex: this.currentTabIndex }, 
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
    }

    private setCurrentTabIndex(index: number) {
        this.currentTabIndex = index;

        // Load the datasource only if not loaded already and the current tab is the first tab.
        if (this.currentTabIndex === 0 && this.dataSource === null && this.isSyncInstalled) {
            this.setDataSource();
        }
    }
    ngOnDestroy(): void {
        this._subscriptions.forEach(sub => sub.unsubscribe);
    }
}