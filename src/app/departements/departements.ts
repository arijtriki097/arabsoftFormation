// ============================================================
// IMPORTS ANGULAR
// ============================================================

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// ============================================================
// IMPORTS SERVICES
// ============================================================

import { DepartementService } from '../services/departement.service';
import { RegionService } from '../services/region.service';
import { ReportService, ReportType } from '../services/ReportService';

// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-departements',

  
  standalone: true,

  
  imports: [CommonModule, FormsModule],

  templateUrl: './departements.html',
  styleUrls: ['./departements.css']
})
export class DepartementsComponent implements OnInit {

  // ============================================================
  // INJECTION DES SERVICES
  // ============================================================
 

  private departementService = inject(DepartementService);
  private regionService = inject(RegionService);
  private reportService = inject(ReportService);
  private router = inject(Router);
  private cdRef = inject(ChangeDetectorRef);

  // ============================================================
  // VARIABLES D'ÉTAT (STATE)
  // ============================================================

  // Données principales
  departements: any[] = [];
  regions: any[] = [];

  // Sélection région pour filtrage / rapport
  selectedRegionIdForReport: number | null = null;

  // Gestion affichage UI
  showAddForm = false;
  showEditModal = false;

  // Messages simples
  errorMessage = '';
  successMessage = '';

  // Notification globale (toast)
  notification = {
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  };

  // Search 
searchTerm: string = '';

  // ============================================================
  // FORMULAIRE AJOUT
  // ============================================================

  newDepartement = {
    name: '',
    regionId: ''
  };

  // ============================================================
  // FORMULAIRE ÉDITION
  // ============================================================

  editDepartement: any = {
    id: null,
    name: '',
    regionId: ''
  };

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
   
    this.loadRegions();
  }

  // ============================================================
  // CHARGEMENT DES DONNÉES
  // ============================================================

  loadRegions(): void {
    this.regionService.getAll().subscribe({
      next: regions => {
        this.regions = regions;

        // Une fois les régions chargées -> départements
        this.loadDepartements();
      },
      error: err => console.error('Erreur chargement régions', err)
    });
  }

  loadDepartements(): void {
    this.departementService.getAll().subscribe({
      next: data => {
        
        // Adapter les données pour l'affichage
        this.departements = data.map(dep => ({
          ...dep,
          regionName: dep.region ? dep.region.name : 'Région inconnue',
          employes: dep.employes || []
        }));

        this.cdRef.detectChanges();
      },
      error: err => console.error('Erreur chargement départements', err)
    });
  }

  // ============================================================
  // AJOUT DÉPARTEMENT
  // ============================================================

  addDepartement(): void {
    this.resetMessages();

    const name = this.newDepartement.name.trim();
    const regionId = Number(this.newDepartement.regionId);

    // Validation
    if (!name) return this.showError('Le nom est obligatoire');
    if (!regionId) return this.showError('Veuillez sélectionner une région');

    // Vérification doublon
    const exists = this.departements.some(dep =>
      dep.name.toLowerCase() === name.toLowerCase() &&
      dep.regionId === regionId
    );

    if (exists) {
      return this.showError('Ce département existe déjà dans cette région');
    }

    // Appel API
    this.departementService.add({ name }, regionId, this.regions).subscribe({
      next: () => {
        this.showSuccess('Département ajouté avec succès');
        this.loadDepartements();

        // Reset formulaire
        this.newDepartement = { name: '', regionId: '' };

        setTimeout(() => this.showAddForm = false, 2000);
      },
      error: err => {
        console.error(err);
        this.showError("Erreur lors de l'ajout");
      }
    });
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.newDepartement = { name: '', regionId: '' };
    this.resetMessages();
  }

  // ============================================================
  // SUPPRESSION
  // ============================================================

  deleteDepartement(id: number): void {
    this.departementService.getById(id).subscribe({
      next: dep => {
        const count = dep.employes?.length || 0;

        const message = count > 0
          ? `⚠️ Ce département contient ${count} employé(s).\nIls seront désaffectés \n Voulez-vous vraiment supprimer ce département ?`
          : 'Voulez-vous vraiment supprimer ce département ?';

        if (confirm(message)) {
          this.performDelete(id, count);
        }
      },
      error: () => {
        if (confirm('Voulez-vous vraiment supprimer ce département ?')) {
          this.performDelete(id, 0);
        }
      }
    });
  }

  private performDelete(id: number, employeeCount: number): void {
    this.departementService.delete(id).subscribe({
      next: () => {
        const msg = employeeCount > 0
          ? `⚠️ Ce département contient  (${employeeCount} employé(s).\nIls seront désaffectés) Voulez-vous vraiment supprimer ce département ?`
          : 'Département supprimé avec succès';

        this.showSuccess(msg);
        this.loadDepartements();
      },
      error: () => this.showError('Erreur lors de la suppression')
    });
  }

  // ============================================================
  // ÉDITION
  // ============================================================

  openEditModal(dep: any): void {
    // Toujours travailler sur une copie
    this.editDepartement = {
      id: dep.id,
      name: dep.name,
      regionId: dep.region?.id || ''
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.resetMessages();
  }

  updateDepartement(): void {
    this.resetMessages();

    if (!this.editDepartement.id) return;
    if (!this.editDepartement.name.trim()) {
      return this.showError('Nom obligatoire');
    }
    if (!this.editDepartement.regionId) {
      return this.showError('Région obligatoire');
    }

    const updated = {
      name: this.editDepartement.name.trim(),
      regionId: Number(this.editDepartement.regionId)
    };

    this.departementService
      .updateDepartement(this.editDepartement.id, updated)
      .subscribe({
        next: () => {
          this.closeEditModal();
          this.showSuccess('Département mis à jour');
          this.loadDepartements();
        },
        error: () => this.showError('Erreur modification')
      });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  viewDepartementDetails(id: number): void {
    this.router.navigate(['/departements', id]);
  }

  // ============================================================
  // RAPPORT PDF
  // ============================================================

  downloadDepartementReport(regionId: number | null): void {
    this.reportService
      .downloadReport(ReportType.DEPARTEMENT, regionId)
      .subscribe({
        next: (blob: Blob) => {
          const regionName = regionId
            ? this.regions.find(r => r.id === regionId)?.name
            : 'Tous';

          const filename = `rapport_departements_${regionName}.pdf`;

          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();

          window.URL.revokeObjectURL(link.href);
          this.showNotification('Rapport téléchargé', 'success');
        },
        error: () => this.showNotification('Erreur téléchargement PDF', 'error')
      });
  }

  // ============================================================
  // FILTRAGE (GETTER)
  // ============================================================

  
  get filteredDepartements(): any[] {
  let result = this.departements;

  // Filtre par région
  if (this.selectedRegionIdForReport) {
    result = result.filter(
      dep => dep.region?.id === this.selectedRegionIdForReport
    );
  }

  // Filtre par recherche
  if (this.searchTerm.trim()) {
    const term = this.searchTerm.toLowerCase();
    result = result.filter(dep =>
      dep.name.toLowerCase().startsWith(term) ||
      dep.regionName?.toLowerCase().startsWith(term)
    );
  }

  return result;
}
 resetFilters(): void {
    this.searchTerm = '';
    this.selectedRegionIdForReport = null;
   
    this.departements = []
   
    this.loadDepartements();
  }
  // ============================================================
  // NOTIFICATIONS & MESSAGES
  // ============================================================

  showError(message: string, duration = 3500): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', duration);
  }

  showSuccess(message: string, duration = 3000): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', duration);
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  showNotification(
    message: string,
    type: 'success' | 'error' | 'info'
  ): void {
    this.notification = { show: true, message, type };
    setTimeout(() => this.notification.show = false, 4000);
  }

  

}
