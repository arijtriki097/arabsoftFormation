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
  // Injection de services
  regionService = inject(RegionService);
  departementService = inject(DepartementService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);

  // Variables principales
  regions: any[] = [];
  selectedRegion: any = null;
  departements: any[] = [];
  filteredDepartements: any[] = [];
  searchTerm = '';
  showAddModal = false;
  showSuccessMessage = false;
  successMessage = '';
  newRegion: any = { name: '' };
  loading = false;

  selectedDepartement: any = null;
  employes: any[] = [];
  filteredEmployes: any[] = [];
  searchEmployeTerm: string = '';
  expandedDeptId: number | null = null; // Pour gérer l'affichage des employés d'un département

  ngOnInit() {
    this.loadRegions();
  }

  // Chargement des régions
  loadRegions() {
    this.loading = true;
    this.regionService.getAll().subscribe({
      next: (data) => {
        this.regions = data || [];
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Erreur load regions:", err);
        this.loading = false;
      }
    });
  }

  // Sélection d'une région
  selectRegion(region: any) {
    this.selectedRegion = region;
    this.loadDepartements(region.id);
  }

  // Chargement des départements et employés
  loadDepartements(regionId: number) {
    this.loading = true;
    this.regionService.getById(regionId).subscribe({
      next: (data: any) => {
        this.departements = data.departements || [];
        this.filteredDepartements = this.departements;
        this.filteredEmployes = this.employes;
        this.cdRef.detectChanges();
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur chargement départements:", err);
        this.departements = [];
        this.filteredDepartements = [];
        this.employes = [];
        this.filteredEmployes = [];
        this.loading = false;
      }
    });
  }

  // Filtrage des départements
  filterDepartements() {
    if (!this.searchTerm.trim()) {
      this.filteredDepartements = this.departements;
      return;
    }
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredDepartements = this.departements.filter(dept =>
      dept.name.toLowerCase().includes(term) ||
      (dept.id && dept.id.toString().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredDepartements = this.departements;
  }

  // Modal ajout région
  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newRegion = { name: '' };
  }

  addRegion() {
    if (!this.newRegion.name.trim()) {
      alert("Le nom de la région est obligatoire");
      return;
    }
    this.regionService.add(this.newRegion).subscribe({
      next: (addedRegion) => {
        this.loadRegions();
        this.closeAddModal();
        this.showSuccess(`Région "${this.newRegion.name}" ajoutée avec succès`);
      },
      error: (err) => console.error("Erreur ajout région:", err)
    });
  }

  showSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

<<<<<<< HEAD
 deleteRegion(id: number) {

  // Récupérer la région avec ses départements
  this.regionService.getById(id).subscribe({
    next: (region: any) => {

      const hasDepartements = region.departements && region.departements.length > 0;
      const departementCount = hasDepartements ? region.departements.length : 0;

      let confirmMessage = '';

      if (hasDepartements) {
        confirmMessage =
          `⚠️ ATTENTION ⚠️\n\n` +
          `Cette région contient ${departementCount} département(s).\n\n` +
          `Si vous supprimez cette région, tous les départements associés seront également supprimés.\n\n` +
          `Êtes-vous sûr de vouloir continuer ?`;
      } else {
        confirmMessage = "Voulez-vous vraiment supprimer cette région ?";
      }

      if (confirm(confirmMessage)) {
        this.performDeleteRegion(id);
      }
    },
    error: (err) => {
      console.error("Erreur récupération région:", err);

      // En cas d’erreur, confirmation simple
      if (confirm("Voulez-vous vraiment supprimer cette région ?")) {
        this.performDeleteRegion(id);
      }
    }
  });
}
private performDeleteRegion(id: number) {
  this.regionService.delete(id).subscribe({
    next: () => {
      if (this.selectedRegion?.id === id) {
        this.selectedRegion = null;
        this.departements = [];
        this.filteredDepartements = [];
      }

      this.loadRegions();
      this.showSuccess("Région supprimée avec succès");
    },
    error: (err) => {
      console.error("Erreur suppression région:", err);
      alert("Erreur lors de la suppression de la région.");
    }
  });
}


  // Filtrage des employés
  filterEmployes() {
    if (!this.searchEmployeTerm.trim()) {
      this.filteredEmployes = this.employes;
      return;
    }
    const term = this.searchEmployeTerm.toLowerCase().trim();
    this.filteredEmployes = this.employes.filter(emp =>
      emp.name?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.phone?.includes(term) ||
      (emp.id && emp.id.toString().includes(term))
    );
  }

  clearEmployeSearch() {
    this.searchEmployeTerm = '';
    this.filteredEmployes = this.employes;
  }

=======
  deleteRegion(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer cette région ?")) return;
    this.regionService.delete(id).subscribe({
      next: () => {
        if (this.selectedRegion?.id === id) {
          this.selectedRegion = null;
          this.departements = [];
          this.filteredDepartements = [];
        }
        this.loadRegions();
        this.showSuccess('Région supprimée avec succès');
      },
      error: (err) => console.error("Erreur suppression région:", err)
    });
  }

  // Filtrage des employés
  filterEmployes() {
    if (!this.searchEmployeTerm.trim()) {
      this.filteredEmployes = this.employes;
      return;
    }
    const term = this.searchEmployeTerm.toLowerCase().trim();
    this.filteredEmployes = this.employes.filter(emp =>
      emp.name?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.phone?.includes(term) ||
      (emp.id && emp.id.toString().includes(term))
    );
  }

  clearEmployeSearch() {
    this.searchEmployeTerm = '';
    this.filteredEmployes = this.employes;
  }

>>>>>>> 89945c38d57db64dc73d4b119559d92eaadbf658
  // Retour à la région depuis un département
  backToRegion() {
    this.selectedDepartement = null;
    this.filteredEmployes = [];
  }

  // Sélection d'un département (pour afficher les employés)
 selectDepartement(dept: any) {
  if (this.expandedDeptId === dept.id) {
    this.expandedDeptId = null; 
    this.selectedDepartement = null;
    this.filteredEmployes = [];
<<<<<<< HEAD
    
=======
>>>>>>> 89945c38d57db64dc73d4b119559d92eaadbf658
    return;
  }

  this.expandedDeptId = dept.id;
  this.selectedDepartement = dept;

  // Charger les employés depuis le backend
  this.departementService.getById(dept.id).subscribe({
    next: (data: any) => {
      this.employes = data.employes || [];
      this.filteredEmployes = this.employes;
      this.cdRef.detectChanges();
<<<<<<< HEAD
      
=======
>>>>>>> 89945c38d57db64dc73d4b119559d92eaadbf658
    },
    error: (err) => {
      console.error("Erreur chargement employés:", err);
      this.employes = [];
      this.filteredEmployes = [];
    }
  });
}

}
