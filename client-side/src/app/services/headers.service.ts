import { Injectable, ɵɵresolveBody } from "@angular/core";
import { Params } from "@angular/router";
import jwt from 'jwt-decode';
import { TranslateService } from "@ngx-translate/core";
import { PepGuid, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { Observable, BehaviorSubject, from, firstValueFrom } from 'rxjs';
import { NavigationService } from "./navigation.service";
import { PUBLISHED_HEADERS_TABLE_NAME, DRAFTS_HEADERS_TABLE_NAME, HeaderTemplateRowProjection } from '../components/application-header.model';
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { config } from '../app.config';
import * as _ from 'lodash';
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { IPepProfile } from "@pepperi-addons/ngx-lib/profile-data-views-list";
import { MenuDataView, PapiClient } from "@pepperi-addons/papi-sdk";
import { coerceNumberProperty } from "@angular/cdk/coercion";
// import { CLIENT_ACTION_ON_CLIENT_APP_HEADER_LOAD, AppHeaderClientEventResult } from 'shared';
interface IHeaderProj {
    key: string, 
    name: string
}

export interface IHeaderData {
    Key?: string;
    Name: string;
    Description: string;
    Hidden?: boolean;
    Draft: boolean;
    Published: boolean;
    Menu: any; // TODO - SET THE TYPE
    Buttons: any; // TODO - SET THE TYPE,
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
    }    

    dispatchEvent(eventData: CustomEventInit<any>) {
        const customEvent = new CustomEvent('emit-event', eventData);
        window.dispatchEvent(customEvent);
    }

    private getBaseUrl(addonUUID: string): string {
        // For devServer run server on localhost.
        if (this.navigationService.devServer) {
            return `http://localhost:4500/api`;
        } else {
            const baseUrl = this.sessionService.getPapiBaseUrl();
            //return `${baseUrl}/addons/api/${addonUUID}/internal_api`;
            return `${baseUrl}/addons/api/${addonUUID}/api`;
        }
    }

    private getCurrentResourceName() {
        return PUBLISHED_HEADERS_TABLE_NAME;
    }

    private showErrorDialog(err: string = ''): MatDialogRef<any> {
        const title = this.translate.instant('MESSAGES.TITLE_NOTICE');
        const dataMsg = new PepDialogData({title, actionsType: "close", content: err || this.translate.instant('MESSAGES.FAILED_TO_GET_SURVEY_VIEW_ERROR')});

        return this.dialog.openDefaultDialog(dataMsg);
    }

    
    /*                            CPI & Server side calls.
    /**************************************************************************************/

    async getHeaders(query?: string) {
        const baseUrl = this.getBaseUrl(config.AddonUUID);
        return this.httpService.getHttpCall(`${baseUrl}/headers?${query || ''}`).toPromise();
    }

    async upsertHeader(header: any, isDelete: boolean = false, selectedObj: PepSelectionData = null) {
        header.Hidden = isDelete;
        const baseUrl = this.getBaseUrl(config.AddonUUID);
        return this.httpService.postHttpCall(`${baseUrl}/headers`, header).toPromise();
    }

    async duplicateHeader(headerUUID: string){
        const baseUrl = this.getBaseUrl(config.AddonUUID);
        return this.httpService.postHttpCall(`${baseUrl}/duplicateHeader`,{headerUUID}).toPromise();
    }

    async deleteHeader(headerUUID: string){
        const baseUrl = this.getBaseUrl(config.AddonUUID);
        return this.httpService.postHttpCall(`${baseUrl}/deleteHeader`,{headerUUID}).toPromise();
    }

    // Get the surveys (distinct with the drafts)
    getHeadersList(addonUUID: string, options: any): Observable<HeaderTemplateRowProjection[]> {
        // Get the header list from the server.
        const baseUrl = this.getBaseUrl(addonUUID);
        return this.httpService.getHttpCall(`${baseUrl}/get_headers_list?resourceName=${this.getCurrentResourceName()}&${options}`);
    }

    async getFlowNameByFlowKey(flowKey: string){
        const baseUrl = this.getBaseUrl(config.AddonUUID);
        return await this.papiClient.userDefinedFlows.key(flowKey).get();
    }

    async cheakIfSyncInstalled(){
        const newSyncUUID = '5122dc6d-745b-4f46-bb8e-bd25225d350a';
        let sync;
        try{
            sync = await firstValueFrom(this.httpService.getPapiApiCall(`/addons/installed_addons/${newSyncUUID}`)) ;
            if(sync?.UUID){
                sync = true;
            }
        }
        catch(err){
            sync = false
        }
       finally{
            return sync;
       }
    }
}
