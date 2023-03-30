import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { MatTabsModule } from '@angular/material/tabs';
import { PepNgxLibModule, PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepSideBarModule } from '@pepperi-addons/ngx-lib/side-bar';
import { PepSizeDetectorModule } from '@pepperi-addons/ngx-lib/size-detector';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepIconRegistry, pepIconSystemClose, pepIconArrowLeftAlt, pepIconNumberPlus } from '@pepperi-addons/ngx-lib/icon';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepProfileDataViewsListModule } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';

import { HeadersManagerComponent } from './headers-manager.component';

const pepIcons = [
    pepIconSystemClose,
    pepIconArrowLeftAlt,
    pepIconNumberPlus
];

export const routes: Routes = [
    {
        path: '',
        component: HeadersManagerComponent
    }
];

@NgModule({
    declarations: [
        HeadersManagerComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        MatIconModule,        
        PepNgxLibModule,
        PepGenericListModule,
        PepSizeDetectorModule,
        PepTopBarModule,
        PepSideBarModule,
        PepPageLayoutModule,
        PepButtonModule,
        PepTextboxModule,
        PepProfileDataViewsListModule,
        PepTextareaModule,
        PepSelectModule, 
        PepMenuModule,
        MatTabsModule,       
        TranslateModule.forChild(),
        RouterModule.forChild(routes)
    ],
    exports:[HeadersManagerComponent]
})
export class HeadersManagerModule {
    constructor(
        private pepIconRegistry: PepIconRegistry
    ) {
        this.pepIconRegistry.registerIcons(pepIcons);
    }
}
