import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Inventory } from 'src/app/services/model';

@Component({
    selector: 'app-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
    @Input() inventories: Inventory[];
    @Output() goToInventory: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {}
}
