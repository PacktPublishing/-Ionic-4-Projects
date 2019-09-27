import { Component, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { StoreService } from '../services/store.service';
import { Store } from '../services/model';
import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { PopoverController, ModalController } from '@ionic/angular';
import { UserPopoverComponent } from '../components/user-popover/user-popover.component';
import { StoreViewComponent } from '../components/store-view/store-view.component';
import { ChatService } from '../services/chat.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    @ViewChild('gmap', { static: true }) gmapElement: any;
    map: google.maps.Map;
    notification$;

    constructor(
        private stores: StoreService,
        private auth: AuthService,
        private popover: PopoverController,
        private modal: ModalController,
        private chat: ChatService
    ) {
        this.loadMap();
        this.auth.watchProfile().subscribe(user => {
            if (user) {
                console.log('new notification set');
                this.notification$ = this.chat.watchNotification(user);
            }
        });
    }

    async userPopover($event) {
        const popover = await this.popover.create({
            component: UserPopoverComponent,
            event: $event,
            translucent: true
        });
        popover.present();
    }

    async loadMap() {
        const currentCoords = await this.getCurrentLocation();
        console.log('user current location', currentCoords);
        const mapProp = {
            center: new google.maps.LatLng(
                currentCoords.latitude,
                currentCoords.longitude
            ),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
        };

        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        this.initAutocomplete(this.map);

        this.stores.stores$.pipe(take(1)).subscribe((stores: Store[]) => {
            stores.forEach(store => {
                const marker = new google.maps.Marker({
                    position: { lat: store.lat, lng: store.lng },
                    map: this.map,
                    icon: 'assets/custom-marker.png'
                });
                marker.addListener('click', () => this.openMarkerInfo(store));
            });
        });
    }

    getCurrentLocation(): Promise<Coordinates> {
        return new Promise(resolve =>
            navigator.geolocation.getCurrentPosition(success => resolve(success.coords))
        );
    }

    async openMarkerInfo(store: Store) {
        const action = await this.modal.create({
            component: StoreViewComponent,
            componentProps: {
                store
            }
        });
        return await action.present();
    }

    initAutocomplete(map) {
        const input = document.getElementById('pac-input');
        const searchBox = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        searchBox.bindTo('bounds', this.map);

        // Set the data fields to return when the user selects a place.
        searchBox.setFields(['address_components', 'geometry', 'icon', 'name']);

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('place_changed', () => {
            const place = searchBox.getPlace();

            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            if (!place.geometry) {
                console.log('Returned place contains no geometry');
                return;
            }

            // If the place has a geometry, then present it on a map.
            console.log('place viewport', place);
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(18);
            }
        });
    }
}
