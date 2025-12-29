import { Component, OnInit, inject, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegionService } from '../services/region.service';
import { DepartementService } from '../services/departement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService, ReportType } from '../services/ReportService';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regions.html',
  styleUrls: ['./regions.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegionsComponent implements OnInit {
private reportService = inject(ReportService);

  // Notification simple
  notification = { show: false, message: '', type: 'info' as 'success' | 'error' | 'info' };
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
  expandedDeptId: number | null = null

  
  ngOnInit() {
    this.loadRegions();
  }

  // REGIONS

  loadRegions() {
    this.loading = true;
    this.regionService.getAll().subscribe({
      next: data => {
        this.regions = data ?? [];
        this.loading = false;
        this.cdRef.detectChanges();
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

  
  // DEPARTEMENTS

  loadDepartements(regionId: number) {
    this.loading = true;
    this.regionService.getById(regionId).subscribe({
      next: data => {
        this.departements = data.departements ?? [];
        this.filteredDepartements = [...this.departements];
        this.loading = false;
         this.cdRef.detectChanges();
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

  
  // EMPLOYES
selectDepartement(dept: any) {
  if (this.expandedDeptId === dept.id) {
    // Si on clique sur le même département, on le ferme
    this.expandedDeptId = null;
    return;
  }

  // Charger les employés AVANT d'ouvrir le département
  this.departementService.getById(dept.id).subscribe({
    next: data => {
      // Stocker les employés directement dans l'objet département
      dept.employes = data.employes ?? [];
      // Ouvrir le département APRÈS avoir chargé les données
      this.expandedDeptId = dept.id;
      this.cdRef.detectChanges();
    },
    error: () => {
      dept.employes = [];
      this.expandedDeptId = dept.id;
      this.cdRef.detectChanges();
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
    this.cdRef.detectChanges();

  }

  backToRegion() {
    this.resetDepartementSelection();
  }


  // ADD REGION
  
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

   showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.notification = { show: true, message, type };
    setTimeout(() => this.notification.show = false, 4000);
  }

  // Télécharger le PDF des régions
  downloadRegionReport(): void {
  this.reportService.downloadReport(ReportType.REGION).subscribe({
    next: (blob: Blob) => {
      const filename = `regions_report.pdf`;

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);

      this.showNotification('Rapport téléchargé avec succès !', 'success');
    },
    error: () => this.showNotification('Erreur lors du téléchargement du PDF', 'error')
  });
}

}
