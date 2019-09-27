import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'inventory-list',
        pathMatch: 'full'
    },
    {
        path: 'inventory-list',
        loadChildren: './inventory-list/inventory-list.module#InventoryListPageModule'
    },
    {
        path: 'inventory-edit/:id',
        loadChildren: './inventory-edit/inventory-edit.module#InventoryEditPageModule'
    },
    {
        path: 'notifications',
        loadChildren:
            './inventory-notifications/inventory-notifications.module#InventoryNotificationsPageModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
