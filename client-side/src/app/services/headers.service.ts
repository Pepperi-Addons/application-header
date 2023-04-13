import { Injectable, ɵɵresolveBody } from "@angular/core";
import { Params } from "@angular/router";
import jwt from 'jwt-decode';
import { TranslateService } from "@ngx-translate/core";
import { PepGuid, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { Observable, BehaviorSubject, from } from 'rxjs';
import { NavigationService } from "./navigation.service";
import { TABLE_NAME, TABLE_NAME_DRAFTS, HeaderTemplateRowProjection } from '../components/application-header.model';
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { config } from '../app.config';
import * as _ from 'lodash';
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { IPepProfile } from "@pepperi-addons/ngx-lib/profile-data-views-list";
import { MenuDataView, PapiClient } from "@pepperi-addons/papi-sdk";
import { coerceNumberProperty } from "@angular/cdk/coercion";

interface IHeaderProj {
    key: string, 
    name: string
}

export interface IHeaderData {
    Key?: string;
    name: string;
    description: string;
    Hidden?: boolean;
    draft: boolean;
    published: boolean;
    menu: any; // TODO - SET THE TYPE
    buttons: any; // TODO - SET THE TYPE,
}

@Injectable({
    providedIn: 'root',
})
export class AppHeadersService {
    
    private readonly HEADERS_DATAVIEW_NAME = 'Headers';

    private addonUUID;
    private papiBaseURL = ''
    private accessToken = '';
    private parsedToken: any

    private _profiles: Array<IPepProfile> = [];
    private _profilesSubject = new BehaviorSubject<ReadonlyArray<IPepProfile>>(this._profiles);
    get profilesChange$(): Observable<ReadonlyArray<IPepProfile>> {
        return this._profilesSubject.asObservable();
    }

    // private _headers: Array<IHeaderProj> = null;
    // private _headersSubject = new BehaviorSubject<ReadonlyArray<IHeaderProj>>(this._headers);
    // get headersChange$(): Observable<ReadonlyArray<IHeaderProj>> {
    //     return this._headersSubject.asObservable();
    // }

    // This subjects is for load the data views into map for better performance.
    private _dataViewsMap = new Map<string, MenuDataView>();
    get dataViewsMap(): ReadonlyMap<string, MenuDataView> {
        return this._dataViewsMap;
    }
    private _dataViewsMapSubject = new BehaviorSubject<ReadonlyMap<string, MenuDataView>>(this.dataViewsMap);
    get dataViewsMapChange$(): Observable<ReadonlyMap<string, MenuDataView>> {
        return this._dataViewsMapSubject.asObservable();
    }
    private _defaultProfileId: string = '';
    get defaultProfileId(): string {
        return this._defaultProfileId;
    }

    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.sessionService.getIdpToken(),
            addonUUID: this.addonUUID,
            suppressLogging:true
        })
    }

    constructor(
        private translate: TranslateService,
        private sessionService: PepSessionService,
        private httpService: PepHttpService,
        private navigationService: NavigationService,
        private dialog: PepDialogService,
    ) {
        this.addonUUID = config.AddonUUID;
        const accessToken = this.sessionService.getIdpToken();
        this.parsedToken = jwt(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"];

        this.loadHeadersDataViewsData();
    }    

   

    private getBaseUrl(addonUUID: string): string {
        // For devServer run server on localhost.
        if (this.navigationService.devServer) {
            return `http://localhost:4401/api`;
        } else {
            const baseUrl = this.sessionService.getPapiBaseUrl();
            return `${baseUrl}/addons/api/${addonUUID}/api`;
        }
    }

    private getCurrentResourceName() {
        return TABLE_NAME;
    }

    private showErrorDialog(err: string = ''): MatDialogRef<any> {
        const title = this.translate.instant('MESSAGES.TITLE_NOTICE');
        const dataMsg = new PepDialogData({title, actionsType: "close", content: err || this.translate.instant('MESSAGES.FAILED_TO_GET_SURVEY_VIEW_ERROR')});

        return this.dialog.openDefaultDialog(dataMsg);
    }

    
    /*                            CPI & Server side calls.
    /**************************************************************************************/

    async getHeaders(query?: string) {
        const baseUrl = this.getBaseUrl('9bc8af38-dd67-4d33-beb0-7d6b39a6e98d');
        return this.httpService.getHttpCall(`${baseUrl}/headers?${query || ''}`).toPromise();
    }

    async upsertHeader(header: any, isDelete: boolean = false, selectedObj: PepSelectionData = null) {
        header.Hidden = isDelete;
        const baseUrl = this.getBaseUrl('9bc8af38-dd67-4d33-beb0-7d6b39a6e98d');
        return this.httpService.postHttpCall(`${baseUrl}/headers`, header).toPromise();
    }

    async duplicateHeader(headerUUID: string){
        const baseUrl = this.getBaseUrl('9bc8af38-dd67-4d33-beb0-7d6b39a6e98d');
        return this.httpService.postHttpCall(`${baseUrl}/duplicateHeader`,{headerUUID}).toPromise();
    }

    async deleteHeader(headerUUID: string){
        const baseUrl = this.getBaseUrl('9bc8af38-dd67-4d33-beb0-7d6b39a6e98d');
        return this.httpService.postHttpCall(`${baseUrl}/deleteHeader`,{headerUUID}).toPromise();
    }

    // Get the surveys (distinct with the drafts)
    getHeadersList(addonUUID: string, options: any): Observable<HeaderTemplateRowProjection[]> {
        // Get the surveys from the server.
        const baseUrl = this.getBaseUrl(addonUUID);
        return this.httpService.getHttpCall(`${baseUrl}/get_headers_list?resourceName=${this.getCurrentResourceName()}&${options}`);
    }


     /**************************** MAPPING TAB *****************************/

     loadHeadersDataViewsData() {
        this.clearMappingData();

        const baseUrl = this.getBaseUrl(this.addonUUID);
        this.httpService.getHttpCall(`${baseUrl}/get_headers_data_views_data`).toPromise().then(res => {

            this._profiles = res.profiles;
            const repProfile = this._profiles.find(profile => profile.name?.toLowerCase() === 'rep');
            this._defaultProfileId = repProfile?.id || '';
            this.notifyProfilesChange();

            if (res.dataViews.length > 0) {
                res.dataViews.forEach(dataView => {
                    this.upsertDataViewToMap(dataView);
                });
                this.notifyHeadersDataViewsMapChange();
            } else {
                const profileId: number = coerceNumberProperty(this._defaultProfileId);
                this.createNewHeadersDataView(profileId);
            }
        });
    }

    private clearMappingData() {
        this._profiles = [];
        //this._headers = [];
        this._dataViewsMap.clear();
    }

    private notifyHeadersDataViewsMapChange() {
        this._dataViewsMapSubject.next(this.dataViewsMap);
    }
    
    // private notifyHeadersChange() {
    //     this._headersSubject.next(this._headers);
    // }
    
    private notifyProfilesChange() {
        this._profilesSubject.next(this._profiles);
    }

    getHeadersDataView(dataViewId) {
        if (this.dataViewsMap.has(dataViewId)) {
            return Promise.resolve([this.dataViewsMap.get(dataViewId)]);
        } else {
            return this.httpService.getPapiApiCall(`/meta_data/data_views?where=InternalID='${dataViewId}'`).toPromise();
        }
    }

    createNewHeadersDataView(profileId: number) {
        const dataView: MenuDataView = {
            Type: 'Menu',
            Hidden: false,
            Context: {
                Name: this.HEADERS_DATAVIEW_NAME,
                Profile: {
                    InternalID: profileId
                },
                ScreenSize: 'Tablet'
            },
            Fields: []
        }

        return this.saveHeadersDataView(dataView);
    }

    async deleteHeadersDataView(dataView: MenuDataView) {
        // Delete the dataview
        if (dataView) {
            dataView.Hidden = true;
            return this.httpService.postPapiApiCall('/meta_data/data_views', dataView).toPromise().then(res => {
                this._dataViewsMap.delete(dataView.InternalID.toString());
                this.notifyHeadersDataViewsMapChange();
            }).catch(err => {
                this.showErrorDialog(err);
            });
        }
    }

    async saveHeadersDataView(dataView: MenuDataView) {
        return this.upsertSlugDataView(dataView).then(dataView => {
            this.upsertDataViewToMap(dataView);
            this.notifyHeadersDataViewsMapChange();
        }).catch(err => {
            this.showErrorDialog(err);
        });
    }

    private upsertDataViewToMap(dataView: MenuDataView) {
        const id = dataView.InternalID?.toString();
        if (id && id.length > 0) {
            this._dataViewsMap.set(id, dataView as MenuDataView);
        }
    }

    private upsertSlugDataView(dataView: MenuDataView) {
        return this.httpService.postPapiApiCall('/meta_data/data_views', dataView).toPromise();
    }
}
