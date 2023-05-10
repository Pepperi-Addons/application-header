import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GeneralModule } from '../components/general/general.module';
import { MenuModule } from '../components/menu/menu.module';
import { ButtonsModule } from "../components/buttons/buttons.module";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';

import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ApplicationHeaderComponent } from './index';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { ThemeheaderlModule } from '../components/theme-header/theme-header.module';



import { config } from '../app.config';


export const routes: Routes = [
    {
        path: '',
        component: ApplicationHeaderComponent
    }
];

@NgModule({
    declarations: [ApplicationHeaderComponent],
    imports: [
        CommonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
        
        RouterModule.forChild(routes),
        MatTabsModule,
        MatExpansionModule,
        PepPageLayoutModule,
        PepTopBarModule,
        PepMenuModule,
        PepButtonModule,
        GeneralModule,
        MenuModule,
        ButtonsModule,
        ThemeheaderlModule  
    ],
    exports: [ApplicationHeaderComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class ApplicationHeaderModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
