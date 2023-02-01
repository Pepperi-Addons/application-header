import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsComponent } from './buttons.component';
import { PepDataViewBuilderModule } from '@pepperi-addons/ngx-composite-lib/data-view-builder';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';

@NgModule({
    declarations: [
        ButtonsComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild(),

        PepDataViewBuilderModule,
        PepTextboxModule,
        PepTextareaModule
    ],
    exports: [ButtonsComponent]
})
export class ButtonsModule { }