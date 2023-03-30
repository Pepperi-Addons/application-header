import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { SettingsComponent } from './settings.component';

const routes: Routes = [
    {
        path: ':settingsSectionName/:addonUUID/:slugName',
        // component: SettingsComponent,
        children: [
            {
                path: ':header_key',
                loadChildren: () => import('../../block/application-header.module').then(m => m.ApplicationHeaderModule)
            },
            {
                path: '**',
                loadChildren: () => import('../headers-manager/headers-manager.module').then(m => m.HeadersManagerModule),
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }



