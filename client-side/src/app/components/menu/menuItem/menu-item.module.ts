import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItemComponent } from './menu-item.component';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
@NgModule({
    declarations: [
        MenuItemComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild(),

        PepTextboxModule,
        PepTopBarModule,
        PepButtonModule,
        PepDialogModule,
        PepGroupButtonsSettingsModule,
        PepTextareaModule
    ],
    exports: [MenuItemComponent]
})
export class MenuItemModule { }