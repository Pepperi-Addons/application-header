import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GeneralComponent } from './general.component';

@NgModule({
    declarations: [
        GeneralComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild()
    ],
    exports: [GeneralComponent]
})
export class GeneralModule { }