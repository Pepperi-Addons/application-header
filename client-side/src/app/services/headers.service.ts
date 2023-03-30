import { Injectable, ɵɵresolveBody } from "@angular/core";
import { Params } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { PepGuid, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { Observable, BehaviorSubject, from } from 'rxjs';
import { NavigationService } from "./navigation.service";
import { TABLE_NAME, TABLE_NAME_DRAFTS, HeaderTemplateRowProjection } from '../components/application-header.model';
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { MatDialogRef } from "@angular/material/dialog";
    
import * as _ from 'lodash';
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
@Injectable({
    providedIn: 'root',
})
export class AppHeadersService {
    

    constructor(
        private translate: TranslateService,
        private sessionService: PepSessionService,
        private httpService: PepHttpService,
        private navigationService: NavigationService,
        private dialog: PepDialogService,
    ) {
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
        //const baseUrl = this.getBaseUrl('4ba5d6f9-6642-4817-af67-c79b68c96977');
        //return this.httpService.getHttpCall(`${baseUrl}/slugs?${query || ''}`).toPromise();
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
}
