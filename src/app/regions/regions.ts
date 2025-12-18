import { Component, OnInit, inject, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegionService } from '../services/region.service';
import { DepartementService } from '../services/departement.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regions.html',
  styleUrls: ['./regions.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegionsComponent implements OnInit {

  regionService = inject(RegionService);
  departementService = inject(DepartementService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);

  regions: any[] = [];
  selectedRegion: any = null;

  departements: any[] = [];
  filteredDepartements: any[] = [];
  searchTerm = '';

  showAddModal = false;
  showSuccessMessage = false;
  successMessage = '';
  newRegion = { name: '' };
  loading = false;

  selectedDepartement: any = null;
  employes: any[] = [];
  filteredEmployes: any[] = [];
  searchEmployeTerm = '';
  expandedDeptId: number | null = null;

  // ============================================================
  ngOnInit() {
    this.loadRegions();
  }

  // ============================================================
  // REGIONS
  // ============================================================
  loadRegions() {
    this.loading = true;
    this.regionService.getAll().subscribe({
      next: data => {
        this.regions = data ?? [];
        this.loading = false;
      },
      error: err => {
        console.error('Erreur load regions:', err);
        this.loading = false;
      }
    });
  }

  selectRegion(region: any) {
    if (this.selectedRegion?.id === region.id) return;
    this.selectedRegion = region;
    this.searchTerm = '';
    this.loadDepartements(region.id);
  }

  deleteRegion(id: number) {
    this.regionService.getById(id).subscribe({
      next: region => {
        const count = region.departements?.length || 0;
        const message = count
          ? `⚠️ Cette région contient ${count} département(s).\nIls seront supprimés.\n\nContinuer ?`
          : 'Voulez-vous vraiment supprimer cette région ?';

        if (confirm(message)) this.performDeleteRegion(id);
      },
      error: () => {
        if (confirm('Voulez-vous vraiment supprimer cette région ?')) {
          this.performDeleteRegion(id);
        }
      }
    });
  }

  private performDeleteRegion(id: number) {
    this.regionService.delete(id).subscribe({
      next: () => {
        if (this.selectedRegion?.id === id) {
          this.resetSelection();
        }
        this.loadRegions();
        this.showSuccess('Région supprimée avec succès');
      },
      error: err => {
        console.error('Erreur suppression région:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }

  // ============================================================
  // DEPARTEMENTS
  // ============================================================
  loadDepartements(regionId: number) {
    this.loading = true;
    this.regionService.getById(regionId).subscribe({
      next: data => {
        this.departements = data.departements ?? [];
        this.filteredDepartements = [...this.departements];
        this.loading = false;
      },
      error: err => {
        console.error('Erreur chargement départements:', err);
        this.departements = [];
        this.filteredDepartements = [];
        this.loading = false;
      }
    });
  }

  filterDepartements() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredDepartements = !term
      ? [...this.departements]
      : this.departements.filter(d =>
          d.name?.toLowerCase().includes(term) ||
          d.id?.toString().includes(term)
        );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredDepartements = [...this.departements];
  }

  // ============================================================
  // EMPLOYES
  // ============================================================
  selectDepartement(dept: any) {
    if (this.expandedDeptId === dept.id) {
      this.resetDepartementSelection();
      return;
    }

    this.expandedDeptId = dept.id;
    this.selectedDepartement = dept;

    this.departementService.getById(dept.id).subscribe({
      next: data => {
        this.employes = data.employes ?? [];
        this.filteredEmployes = [...this.employes];
      },
      error: () => {
        this.employes = [];
        this.filteredEmployes = [];
      }
    });
  }

  filterEmployes() {
    const term = this.searchEmployeTerm.trim().toLowerCase();
    this.filteredEmployes = !term
      ? [...this.employes]
      : this.employes.filter(e =>
          e.name?.toLowerCase().includes(term) ||
          e.email?.toLowerCase().includes(term) ||
          e.phone?.includes(term) ||
          e.id?.toString().includes(term)
        );
  }

  clearEmployeSearch() {
    this.searchEmployeTerm = '';
    this.filteredEmployes = [...this.employes];
  }

  backToRegion() {
    this.resetDepartementSelection();
  }

  // ============================================================
  // ADD REGION
  // ============================================================
  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newRegion = { name: '' };
  }

  addRegion() {
    if (!this.newRegion.name.trim()) {
      alert('Le nom de la région est obligatoire');
      return;
    }

    this.regionService.add(this.newRegion).subscribe({
      next: () => {
        this.loadRegions();
        this.closeAddModal();
        this.showSuccess(`Région "${this.newRegion.name}" ajoutée avec succès`);
      },
      error: err => console.error('Erreur ajout région:', err)
    });
  }

  // ============================================================
  showSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => this.showSuccessMessage = false, 3000);
  }

  private resetSelection() {
    this.selectedRegion = null;
    this.resetDepartementSelection();
    this.departements = [];
    this.filteredDepartements = [];
  }

  private resetDepartementSelection() {
    this.expandedDeptId = null;
    this.selectedDepartement = null;
    this.employes = [];
    this.filteredEmployes = [];
    this.searchEmployeTerm = '';
  }
}
