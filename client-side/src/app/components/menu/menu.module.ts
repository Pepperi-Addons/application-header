import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from './menu.component';

import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';

@NgModule({
    declarations: [
        MenuComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild(),

        PepTextboxModule,
        PepTextareaModule
    ],
    exports: [MenuComponent]
})
export class MenuModule { }