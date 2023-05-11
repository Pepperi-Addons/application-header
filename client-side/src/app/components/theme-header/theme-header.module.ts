import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeheaderComponent } from './theme-header.component';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
import { PepShadowSettingsModule } from '@pepperi-addons/ngx-composite-lib/shadow-settings';
import { PepSliderModule } from '@pepperi-addons/ngx-lib/slider';

@NgModule({
    declarations: [
        ThemeheaderComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild(),

        PepTextboxModule,
        PepTextareaModule,
        PepButtonModule,
        MatExpansionModule,
        PepCheckboxModule,
        PepGroupButtonsSettingsModule,
        PepShadowSettingsModule,
        PepSliderModule,
        PepSelectModule

    ],
    exports: [ThemeheaderComponent]
})
export class ThemeheaderlModule { }