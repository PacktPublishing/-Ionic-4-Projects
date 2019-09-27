import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Inventory } from '../services/model';
import { InventoryService } from '../services/inventory.service';
import { Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AuthService } from '../services/auth.service';
import { base64Img } from 'src/assets/testimg';

@Component({
    selector: 'app-inventory-edit',
    templateUrl: './inventory-edit.page.html',
    styleUrls: ['./inventory-edit.page.scss']
})
export class InventoryEditPage implements OnInit {
    @ViewChild('imageUpload', { static: false }) imageUpload: ElementRef<
        HTMLInputElement
    >;

    userIsAdmin = this.auth.isAdmin$();

    inventory;
    imageData;
    imageType: 'base64' | 'blob';

    state = {
        saving: false
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private inventoryServ: InventoryService,
        private platform: Platform,
        private camera: Camera,
        private auth: AuthService
    ) {
        this.route.paramMap
            .pipe(
                switchMap(params =>
                    combineLatest([
                        this.inventoryServ.getById(params.get('id')),
                        this.route.queryParamMap
                    ])
                ),
                map(([data, queryParams]) => {
                    console.log('queryparams', data, queryParams);
                    if (data) {
                        this.inventory = data;
                        this.imageData = this.inventory.imageUrl;
                    } else {
                        this.inventory = new Inventory();
                        this.inventory.code = queryParams.get('code');
                    }
                })
            )
            .subscribe();
    }

    ngOnInit() {}

    addQty() {
        this.inventory.quantity++;
    }

    removeQty() {
        this.inventory.quantity--;
    }

    save() {
        this.state.saving = true;
        const imgBlob =
            this.imageType === 'blob'
                ? this.imageUpload.nativeElement.files[0]
                : this.imageData;
        this.inventoryServ
            .saveInventory(this.inventory, imgBlob, this.imageType)
            .then(() => {
                this.state.saving = false;
                window.history.back();
            });
    }

    async launchCamera() {
        if (this.platform.is('mobile')) {
            const options: CameraOptions = {
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE
            };

            let imageData;
            imageData = await this.camera.getPicture(options);
            const base64Image = 'data:image/jpeg;base64,' + imageData;
            this.imageData = base64Image;
            this.imageType = 'base64';
        } else {
            console.log('this.imageUpload', this.imageUpload);
            this.imageUpload.nativeElement.click();
        }
    }

    uploadImage(el) {
        const preview = URL.createObjectURL(el.files[0]);
        console.log('uploadImage()', el.files[0], URL.createObjectURL(el.files[0]));
        this.imageData = preview; // this is not the actual saved image yet
        this.imageType = 'blob';
    }

    async delete(id) {
        await this.inventoryServ.deleteInventory(id);
        this.router.navigate(['']);
    }

    async notifyRestock() {
        this.inventory.notification = true;
        await this.inventoryServ.saveInventory(this.inventory);
        this.inventoryServ.notifyRestock();
        this.router.navigate(['/']);
    }
}
