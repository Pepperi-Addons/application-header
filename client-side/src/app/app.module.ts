import { DoBootstrap, Injector, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';

import { SettingsComponent, SettingsModule } from './components/settings';
import { HeadersManagerModule } from './components/headers-manager/headers-manager.module';
//import { ApplicationHeaderModule, ApplicationHeaderComponent } from './block';
// import { ApplicationHeaderEditorModule, ApplicationHeaderEditorComponent } from './block-editor';

import { config } from './app.config';
//import { ManageHeadersModule } from './components/headers-manager/manage-headers.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HeadersManagerModule,
        //ManageHeadersModule,
        //ApplicationHeaderModule,
        //ApplicationHeaderEditorModule,
        SettingsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }
        }),
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [
        // AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    constructor(
        private injector: Injector,
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }

    ngDoBootstrap() {
        this.pepAddonService.defineCustomElement(`settings-element-${config.AddonUUID}`, SettingsComponent, this.injector);
        //this.pepAddonService.defineCustomElement(`settings-element-${config.AddonUUID}`, ApplicationHeaderComponent, this.injector);

        //this.pepAddonService.defineCustomElement(`applicationheader-element-${config.AddonUUID}`, ApplicationHeaderComponent, this.injector);
        //this.pepAddonService.defineCustomElement(`applicationheader-editor-element-${config.AddonUUID}`, ApplicationHeaderEditorComponent, this.injector);
    }
}

