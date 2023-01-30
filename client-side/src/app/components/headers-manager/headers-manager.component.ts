import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { first, Subscription, firstValueFrom } from 'rxjs';
import { PepAddonService, PepLayoutService, PepScreenSizeType, PepUtilitiesService } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListDataSource, IPepGenericListPager, IPepGenericListActions, IPepGenericListInitData, PepGenericListService } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { DataViewFieldType, GridDataViewField, Page } from '@pepperi-addons/papi-sdk';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { NavigationService } from "../../services/navigation.service";
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { PepAddonBlockLoaderService } from "@pepperi-addons/ngx-lib/remote-loader";

import { HeaderTemplateRowProjection } from "../application-header.model";


@Component({
    selector: 'headers-manager',
    templateUrl: './headers-manager.component.html',
    styleUrls: ['./headers-manager.component.scss'],
    providers: [  ],
})
export class HeadersManagerComponent implements OnInit, OnDestroy {
    screenSize: PepScreenSizeType;

    dataSource: IPepGenericListDataSource;
    //actions: IPepGenericListActions;

    totalHeaders: number = 0;
    headers: HeaderTemplateRowProjection[];

    private _subscriptions: Subscription[] = [];

    constructor(
        public layoutService: PepLayoutService,
        private pepAddonService: PepAddonService,
        public translate: TranslateService,
        private _navigationService: NavigationService,        
        private _activatedRoute: ActivatedRoute,
        private dialog: PepDialogService,
        private utilitiesService: PepUtilitiesService,
        private pepAddonBlockLoader: PepAddonBlockLoaderService,
        private viewContainerRef: ViewContainerRef
    ) {
        this.pepAddonService.setShellRouterData({ showSidebar: true, addPadding: true});
       
        this._subscriptions.push(this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        }));
    }

    ngOnInit() {
        this.dataSource = this.setDataSource();
    }

    setDataSource() {
        return {
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
                //TODO - GET HEADERS TEMPLATES
                //this.headers = await firstValueFrom(this.headersService.getHeaderTemplates(this._navigationService.addonUUID, encodeURI(options)));

                this.totalHeaders = this.headers?.length || 0;

                return {
                    items: this.headers,
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
                            this.getRegularReadOnlyColumn('Active', 'Boolean'),
                            this.getRegularReadOnlyColumn('DateRange'),
                            this.getRegularReadOnlyColumn('Draft', 'Boolean'),
                            this.getRegularReadOnlyColumn('Published', 'Boolean'),
                            //this.getRegularReadOnlyColumn('CreationDate', 'DateAndTime'),
                            this.getRegularReadOnlyColumn('ModificationDate', 'DateAndTime'),
                            // this.getRegularReadOnlyColumn('StatusName')
                        ],
                        Columns: [
                            { Width: 20 },
                            { Width: 25 },
                            { Width: 8 },
                            { Width: 24 },
                            { Width: 6 },
                            { Width: 10 },
                            { Width: 17 }
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
                        title: this.translate.instant("ACTIONS.EDIT"),
                        handler: async (data: PepSelectionData) => {
                            this._navigationService.navigateToHeader(data?.rows[0]);
                        }
                    }, {
                        title: this.translate.instant("ACTIONS.DELETE"),
                        handler: async (data: PepSelectionData) => {
                            if (data?.rows.length > 0) {
                                this.deleteHeaderTemplate(data?.rows[0]);
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

    onAddHeaderClicked() {
        this._navigationService.navigateToHeader('1234');
        // this.headersService.createNewHeaderTemplate(this._navigationService.addonUUID, this.totalHeaders).pipe(first()).subscribe((header: HeaderTemplate) => {
        //     if (header) {
                // this._navigationService.navigateToHeader(header.Key);
        //     } else {
        //         // TODO: show error.
        //     }
        // });
    }

    deleteHeaderTemplate(headerID: string) {
        const content = this.translate.instant('HEADERS_MANAGER.DELETE_HEADER.MSG');
        const title = this.translate.instant('HEADERS_MANAGER.DELETE_HEADER.TITLE');
        const dataMsg = new PepDialogData({title, actionsType: "cancel-delete", content});

        this.dialog.openDefaultDialog(dataMsg).afterClosed().pipe(first()).subscribe((isDeletePressed) => {
            if (isDeletePressed) {
                // this.headersService.deleteHeaderTemplate(this._navigationService.addonUUID, headerID).pipe(first()).subscribe((res) => {
                //          this.dataSource = this.setDataSource();
                //  });
            }
        });
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach(sub => sub.unsubscribe);
    }
}