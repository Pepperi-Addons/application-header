import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
        path: '**',
        loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule),

    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }