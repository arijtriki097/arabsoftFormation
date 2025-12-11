import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartementService } from '../services/departement.service';

@Component({
  selector: 'app-departement-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departement-details.component.html',
  styleUrls: ['./departement-details.component.css']
})
export class DepartementDetailsComponent implements OnInit {

  departementService = inject(DepartementService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  departement: any = null;
  employes: any[] = [];
  filteredEmployes: any[] = [];
  searchTerm: string = '';
  loading = true;

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.loadDepartementDetails(id);
  }

  loadDepartementDetails(id: number) {
    this.loading = true;
    this.departementService.getById(id).subscribe({
      next: (data) => {
        console.log("Détails département:", data);
        this.departement = data;
        this.employes = data.employes || [];
        this.filteredEmployes = this.employes;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement département:", err);
        this.departement = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterEmployes() {
    if (!this.searchTerm.trim()) {
      this.filteredEmployes = this.employes;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredEmployes = this.employes.filter(emp =>
        emp.name?.toLowerCase().includes(term) ||
        emp.email?.toLowerCase().includes(term) ||
        emp.phone?.includes(term) ||
        (emp.id && emp.id.toString().includes(term))
      );
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredEmployes = this.employes;
  }

  goBack() {
    this.router.navigate(['/regions', this.departement.region.id]);
  }

  goToRegion() {
    this.router.navigate(['/regions', this.departement.region.id]);
  }
}