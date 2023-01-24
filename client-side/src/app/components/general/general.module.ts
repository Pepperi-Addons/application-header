import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GeneralComponent } from './general.component';

import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';

@NgModule({
    declarations: [
        GeneralComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild(),

        PepTextboxModule,
        PepTextareaModule
    ],
    exports: [GeneralComponent]
})
export class GeneralModule { }