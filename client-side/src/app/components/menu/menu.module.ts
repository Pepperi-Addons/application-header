import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepDraggableItemsModule } from '@pepperi-addons/ngx-lib/draggable-items';
import { MenuComponent } from './menu.component';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { MenuItemModule } from './menuItem/menu-item.module';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
@NgModule({
    declarations: [
        MenuComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        DragDropModule,
        PepDraggableItemsModule,
        MenuItemModule,
        PepTextboxModule,
        PepButtonModule,
        PepDialogModule,
        PepGroupButtonsSettingsModule,
        PepTextareaModule
    ],
    exports: [MenuComponent]
})
export class MenuModule { }