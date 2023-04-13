import { Injectable, ViewContainerRef } from "@angular/core";
import { NavigationService } from "./navigation.service";
import { PepDIMXHelperService } from "@pepperi-addons/ngx-composite-lib";

const TABLE_NAME_DRAFTS = 'AppHeadersDrafts';
const TABLE_NAME = 'AppHeaders';

@Injectable()
export class DIMXService {
    constructor(
        private navigationService: NavigationService,
        private dimxService: PepDIMXHelperService
    ) {
    }

    register(viewContainerRef: ViewContainerRef, onDIMXProcessDoneCallback: (dimxEvent: any) => void) {
        const dimxHostObject = {
            DIMXAddonUUID: this.navigationService.addonUUID,
            DIMXResource: TABLE_NAME_DRAFTS
        };

        this.dimxService.register(viewContainerRef, dimxHostObject, onDIMXProcessDoneCallback);
    }

    import() {
        const options = {
            OwnerID: this.navigationService.addonUUID,
        };
        //this.dimxService.recursive_import(options);
        this.dimxService.import(options); 
    }

    export(headerUUID: string, headerName: string) {
        const options = { 
            DIMXExportFormat: 'json',
            DIMXExportIncludeDeleted: true,
            DIMXExportFileName: `header_${headerUUID}`,
            DIMXExportWhere: 'Key="' + headerUUID + '"'
        };
        //this.dimxService.recursive_export(options);
        this.dimxService.export(options);
    }
}