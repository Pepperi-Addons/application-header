import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DesignComponent } from './design.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepColorModule } from '@pepperi-addons/ngx-lib/color';

@NgModule({
    declarations: [
        DesignComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild(),

        MatExpansionModule,
        PepTextboxModule,
        PepTextareaModule,
        PepSelectModule,
        PepCheckboxModule,
        PepColorModule
    ],
    exports: [DesignComponent]
})
export class DesignModule { }