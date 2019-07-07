import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealdbApiService } from '../services/mealdb-api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MEALDB_Meal } from '../services/model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-meal',
    templateUrl: './meal.page.html',
    styleUrls: ['./meal.page.scss']
})
export class MealPage implements OnInit {
    id: string;
    meal$: Observable<any>;
    ingredients;
    instructions;
    constructor(
        private activatedRoute: ActivatedRoute,
        private mealdb: MealdbApiService,
        private sanitizer: DomSanitizer
    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.meal$ = this.mealdb.getMealById(this.id).pipe(
            tap(meal => {
                console.log(meal);
                this.ingredients = this.getIngredientsArray(meal);
                this.instructions = this.convertInstructionToArray(meal);
            })
        );
    }

    ngOnInit() {}

    getYoutubeLink(meal: MEALDB_Meal) {
        // "https://www.youtube.com/watch?v=NZVo32n7iS8"
        const id = meal.strYoutube.split('=')[1];
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${id}?autoplay=1&origin=http://example.com`
        );
    }

    getIngredientsArray(meal: MEALDB_Meal) {
        const results = [];
        for (let i = 1; i <= 20; i++) {
            results.push([meal['strIngredient' + i], meal['strMeasure' + i]]);
        }
        return results.filter(i => !!i[0]);
    }

    convertInstructionToArray(meal: MEALDB_Meal) {
        return meal.strInstructions.split('\n').filter(i => i.trim());
    }
}
