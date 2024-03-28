import { Injectable, ɵɵresolveBody } from "@angular/core";
//import { Params } from "@angular/router";
import jwt from 'jwt-decode';
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { BehaviorSubject, distinctUntilChanged, Observable, firstValueFrom } from "rxjs";
import { NavigationService } from "./navigation.service";
import { PUBLISHED_HEADERS_TABLE_NAME, HeaderTemplateRowProjection } from '../components/application-header.model';
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { config } from '../app.config';
import * as _ from 'lodash';
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
//import { IPepProfile } from "@pepperi-addons/ngx-lib/profile-data-views-list";
import { MenuDataView, PapiClient, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { APIHeaderButton, APIMenuItem } from "shared";

//import { coerceNumberProperty } from "@angular/cdk/coercion";
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
    Menu: Array<APIMenuItem>;
    Buttons: Array<APIHeaderButton>;
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

    private showErrorDialog(err: string = ''): MatDialogRef<any> {
        const title = this.translate.instant('MESSAGES.TITLE_NOTICE');
        const dataMsg = new PepDialogData({title, actionsType: "close", content: err || this.translate.instant('MESSAGES.FAILED_TO_GET_SURVEY_VIEW_ERROR')});

        return this.dialog.openDefaultDialog(dataMsg);
    }

    /******************************** FLOW SERVICES *****************************************/

       // This subject is for load page parameter options on the filter editor (Usage only in edit mode).
       private _pageParameterOptionsSubject: BehaviorSubject<Array<IPepOption>> = new BehaviorSubject<Array<IPepOption>>([]);
       get pageParameterOptionsSubject$(): Observable<Array<IPepOption>> {
           return this._pageParameterOptionsSubject.asObservable().pipe(distinctUntilChanged());
       }
   
       // This subjects is for dynamic parameters in Options source flow (Usage only in edit mode).
       private _flowDynamicParameters = new Map<string, SchemeFieldType>();
       get flowDynamicParameters(): ReadonlyMap<string, SchemeFieldType> {
           return this._flowDynamicParameters;
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

    async getThemes(){
        return  await this.httpService.getWapiApiCall('Service1.svc/v1/addons/api/95501678-6687-4fb3-92ab-1155f47f839e/addon-cpi/themes').toPromise();
        //const theme = await this.papiClient.get('/addons/api/95501678-6687-4fb3-92ab-1155f47f839e/api/themes');
        //const theme = await this.papiClient.addons.uuid().get();
    }
}
