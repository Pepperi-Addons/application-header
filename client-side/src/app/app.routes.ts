import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationHeaderComponent } from './block';
import { HeadersManagerComponent } from '../app/components/headers-manager/headers-manager.component';

// const routes: Routes = [
//     {
//         path: '**',
//         loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule),
//     }
// ];
// Important for single spa
@Component({
    selector: 'app-empty-route',
    template: '<div></div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    {
        path: `settings/:addon_uuid`,
        children: [
            {
                path: 'application_header',
                component: HeadersManagerComponent,
            },
            {
                path: 'application_header/:header_uuid',
                component: ApplicationHeaderComponent
            }
        ]
    },
    {
        // path: '**',
        // loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule),
        path: '**',
        component: EmptyRouteComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }