import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPopoverComponent } from './user-popover/user-popover.component';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { StoreViewComponent } from './store-view/store-view.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [UserPopoverComponent, StoreViewComponent],
    imports: [CommonModule, IonicModule, FormsModule],
    exports: [UserPopoverComponent, StoreViewComponent]
})
export class ComponentsModule {}
