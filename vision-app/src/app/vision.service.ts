import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VisionService {
    constructor(private http: HttpClient) {}

    getLabels(base64Image) {
        const body = {
            requests: [
                {
                    image: {
                        content: base64Image
                    },
                    features: [
                        {
                            type: 'LABEL_DETECTION',
                            maxResults: 5
                        }
                    ]
                }
            ]
        };

        return this.http
            .post<any>(
                `https://vision.googleapis.com/v1/images:annotate?key=${
                    environment.googleApiKey
                }`,
                body
            )
            .toPromise();
    }
}
