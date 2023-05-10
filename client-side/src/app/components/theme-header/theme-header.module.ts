import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeheaderComponent } from './theme-header.component';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';

import { MatExpansionModule } from '@angular/material/expansion';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';


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
        PepSelectModule

    ],
    exports: [ThemeheaderComponent]
})
export class ThemeheaderlModule { }