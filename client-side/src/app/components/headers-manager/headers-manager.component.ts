import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { first, Subscription, firstValueFrom } from 'rxjs';
import { DIMXService } from "../../services/dimx.service";
import { PepAddonService, PepLayoutService, PepScreenSizeType, PepUtilitiesService } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListDataSource, IPepGenericListPager, IPepGenericListActions, IPepGenericListInitData, PepGenericListService, IPepGenericListEmptyState } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { DataViewFieldType, GridDataViewField, MenuDataView, Page } from '@pepperi-addons/papi-sdk';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { NavigationService } from "../../services/navigation.service";
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { PepAddonBlockLoaderService } from "@pepperi-addons/ngx-lib/remote-loader";
import { coerceNumberProperty } from "@angular/cdk/coercion";
import { ConfigurationSchemaName } from "shared";
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
    protected configurationHostObject: any = null;
    protected remoteEntry = ''; //'http://localhost:4401/file_84c999c3-84b7-454e-9a86-71b7abc96554.js';
    emptyState: IPepGenericListEmptyState = {
        show: true
    };

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
        public layoutService: PepLayoutService,
        private pepAddonService: PepAddonService,
        public translate: TranslateService,
        private _navigationService: NavigationService,        
        private appHeadersService: AppHeadersService
    ) { 
        this.translate.get(['HEADERS_MANAGER.NO_PAGES_MSG', 'HEADERS_MANAGER.PAGES_HEADER']).subscribe(res => {
            
            this.emptyState = {
                show: true,
                description: res?.length > 0 ? res[0] : this.translate.instant('HEADERS_MANAGER.NO_PAGES_MSG'),
                title: res?.length > 1 ? res[1] : this.translate.instant('HEADERS_MANAGER.PAGES_HEADER'),
            }
        })
        this.pepAddonService.setShellRouterData({ showSidebar: true, addPadding: true});
        this._subscriptions.push(this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        }));
    }

    async ngOnInit() {
        // checking if new sync is installed , if not --> lock the appHeader editor
            this.isSyncInstalled =  await this.appHeadersService.cheakIfSyncInstalled();
            
            this.translate.get('HEADERS_MANAGER.LIST_HEADER').subscribe(title => {
                this.configurationHostObject = {
                    addonUUID: this._navigationService.addonUUID,
                    configurationSchemaName: ConfigurationSchemaName,
                    title: title,
                    emptyState: this.emptyState
                    // lineMenu: ConfigurationLineMenuItem[],
                    // menu: ConfigurationMenuItem[],
                };
            });

            const index = coerceNumberProperty(this.activatedRoute.snapshot.queryParamMap.get('tabIndex'), 0);
            this.setCurrentTabIndex(index);  
    }

    onConfigurationHostEvent(event: any) {
        if (event.name === 'onListLoad') {
            //this.totalPages = event.data?.totalCount || 0;
        } else if (event.name === 'onListFieldClick') {
            this._navigationService.navigateToHeader(event.data?.id);
        } else if (event.name === 'onMenuItemClick') {
            if (event.action === 'add') {
                this._navigationService.navigateToHeader();
                //this.addNewPage();
            } else if (event.action === 'edit') {
                this._navigationService.navigateToHeader(event.data?.key);
            }
        }
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
        // if (this.currentTabIndex === 0 && this.dataSource === null && this.isSyncInstalled) {
        //     this.setDataSource();
        // }
    }
    ngOnDestroy(): void {
        this._subscriptions.forEach(sub => sub.unsubscribe);
    }
}