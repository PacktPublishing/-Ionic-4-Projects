import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListItemComponent } from './list-item/list-item.component';

@NgModule({
    declarations: [ListItemComponent],
    imports: [CommonModule, IonicModule],
    exports: [ListItemComponent]
})
export class ComponentsModule {}
