import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { MEALDB_Category, MEALDB_ListItem, MEALDB_Meal } from './model';

export const MEALDB_API = {
    ROOT: 'https://www.themealdb.com/api/json/v1/1/',
    get FILTER() {
        return this.ROOT + 'filter.php';
    },
    get LOOKUP() {
        return this.ROOT + 'lookup.php';
    }
};

@Injectable({
    providedIn: 'root'
})
export class MealdbApiService {
    meals$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    usedIds = new Set();
    constructor(private http: HttpClient) {}

    getMealById(id: string): Observable<MEALDB_Meal> {
        return this.http
            .get(`${MEALDB_API.LOOKUP}?i=${id}`)
            .pipe(map((res: { meals: MEALDB_Meal[] }) => res.meals[0]));
    }

    getWhatToEat(): Observable<void> {
        const categoryAsArray = Object.keys(MEALDB_Category).map(i => MEALDB_Category[i]);
        const eightCategories = this._randomFromArray(categoryAsArray, 8);
        // console.log('eightCategories', eightCategories);
        const arrayOfHttpCalls = eightCategories.map(category =>
            this.getMealsByCategory(category)
        );
        // console.log('arrayOfHttpCalls', arrayOfHttpCalls);
        return forkJoin(arrayOfHttpCalls).pipe(
            map((res: Array<MEALDB_ListItem>) => {
                // [].concat(res)
                // console.log('response from httpCalls', res);
                this.meals$.next(this.meals$.getValue().concat(res));
            })
        );
    }

    getMealsByCategory(category: string): Observable<MEALDB_ListItem> {
        return this.http.get(`${MEALDB_API.FILTER}?c=${category}`).pipe(
            map((res: any) => {
                if (res.meals) {
                    let count = 0;
                    let results;
                    while (
                        (!results ||
                            !results.strMealThumb ||
                            this.usedIds.has(results.idMeal)) &&
                        count < 5
                    ) {
                        results = this._randomFromArray(res.meals)[0];
                        count++;
                    }
                    this.usedIds.add(results.idMeal);
                    return results;
                }
            })
        );
    }

    private _randomFromArray(array, times = 1): any[] {
        const results = [];
        for (let i = 0; i < times; i++) {
            const randomIndex = Math.floor(Math.random() * array.length);
            results.push(array[randomIndex]);
        }
        return results;
    }
}
