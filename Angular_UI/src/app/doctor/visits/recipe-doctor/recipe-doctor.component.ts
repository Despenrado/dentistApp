import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PatientInfoResponseModel, Tooth } from 'src/app/models/patient';
import { Recipe } from 'src/app/models/recipe';
import { VisitResponseModel } from 'src/app/models/visit';
import { JawService } from 'src/app/services/jaw.service';
import { PatientService } from 'src/app/services/patient.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { VisitService } from 'src/app/services/visit.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { RecipeDetailsComponent } from 'src/app/shared/recipe-details/recipe-details.component';

@Component({
  selector: 'app-recipe-doctor',
  templateUrl: './recipe-doctor.component.html',
  styleUrls: ['./recipe-doctor.component.scss']
})
export class RecipeDoctorComponent implements OnInit, OnDestroy {

  visitId: string;
  visit: VisitResponseModel;
  teeth: Tooth[];
  patient: PatientInfoResponseModel;
  recipeList: Recipe[] = [];
  sub = new Subscription();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableColumns: string[] =['nr', 'dateTime', 'lastDate', 'edit', 'delete'];
  dataSource: MatTableDataSource<Recipe>;

  constructor(private route: ActivatedRoute,
              private visitService: VisitService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: SnackbarService,
              private recipeService: RecipeService,
              private patientService: PatientService,
              private jawService: JawService) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.visitId = this.route.snapshot.params.id;
    this.getData();
  }

  getData() {
    this.sub.add(this.visitService.getVisit(this.visitId).subscribe(res => {
      this.visit = res;
      this.sub.add(this.patientService.getPatientById(this.visit.patientId).subscribe(res => {
        this.patient = res;
      }))
      this.getTeeth();
      if(!res.recipes) {
        return;
      }
      this.recipeList = res.recipes.filter(ele => ele != null);
      this.dataSource = new MatTableDataSource(this.recipeList)
      this.dataSource.paginator = this.paginator;
    }))
  }

  addRecipe() {
    const dialogRef = this.dialog.open(RecipeDetailsComponent, {
      data: {
        visitId: this.visitId
      }
    });
    this.sub.add(dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.getData();
      }
    }))
  }

  getTeeth() {
    this.sub.add(this.jawService.getJaw(this.visit.patientId).subscribe(res => {
      this.teeth = res;
    }))
  }
  
  applyFilter($event) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteRecipe(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        text: "Czy na pewno chcesz usunąć receptę?"
      }
    });
    this.sub.add(dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.sub.add(this.recipeService.deleteRecipe(this.visitId, id).subscribe(res => {
          this.snackBar.success('Recepta usunięta');
          this.getData();
        }, err => {
          this.snackBar.error('Recepta nie została usunięta');
        }))
      }
    }))
  }

  editRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(RecipeDetailsComponent, {
      data: {
        visitId: this.visitId,
        recipe
      }
    });
    this.sub.add(dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.getData();
      }
    }))
  }

  back() {
    this.router.navigate(['doctor/visits'])
  }
}
