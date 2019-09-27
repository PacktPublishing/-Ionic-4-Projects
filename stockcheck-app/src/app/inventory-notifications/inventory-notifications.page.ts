import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Inventory } from '../services/model';

@Component({
    selector: 'app-inventory-notifications',
    templateUrl: './inventory-notifications.page.html',
    styleUrls: ['./inventory-notifications.page.scss']
})
export class InventoryNotificationsPage implements OnInit {
    public inventories$ = this.inventoryServ.lowInventories$.pipe(
        tap(data => console.log('getting inventories$', data))
    );

    constructor(
        private inventoryServ: InventoryService,
        private router: Router,
        private menu: MenuController
    ) {}

    ngOnInit() {}

    goToInventory(id) {
        this.router.navigate(['inventory-edit', id]);
    }

    openMenu() {
        this.menu.open();
    }
}
