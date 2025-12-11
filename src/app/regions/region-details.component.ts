import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegionService } from '../services/region.service';

@Component({
  selector: 'app-region-details',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './region-details.html',
  styleUrls: ['./region-details.css']
})
export class RegionDetailsComponent implements OnInit {

  regionService = inject(RegionService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  region: any = null;
  departements: any[] = [];
  filteredDepartements: any[] = []; // ← Nouvelle propriété pour les départements filtrés
  searchTerm: string = ''; // ← Nouvelle propriété pour le terme de recherche
  loading = true;

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.loadRegionDetails(id);
  }

  loadRegionDetails(id: number) {
    this.loading = true;
    this.regionService.getById(id).subscribe({
      next: (data) => {
        console.log("Détails région:", data);
        this.region = data;
        this.departements = data.departements || [];
        this.filteredDepartements = this.departements; // ← Initialiser les départements filtrés
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement région:", err);
        this.region = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ← Nouvelle méthode de filtrage
  filterDepartements() {
    if (!this.searchTerm.trim()) {
      this.filteredDepartements = this.departements;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredDepartements = this.departements.filter(dept =>
        dept.name.toLowerCase().includes(term) ||
        (dept.id && dept.id.toString().includes(term))
      );
    }
  }

  // ← Nouvelle méthode pour réinitialiser la recherche
  clearSearch() {
    this.searchTerm = '';
    this.filteredDepartements = this.departements;
  }

  goBack() {
    this.router.navigate(['/regions']);
  }
}