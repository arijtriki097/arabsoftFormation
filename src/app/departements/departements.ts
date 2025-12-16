import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartementService } from '../services/departement.service';
import { RegionService } from '../services/region.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departements.html',
  styleUrls: ['./departements.css']
})
export class DepartementsComponent implements OnInit {

  // --------------------------
  // Services
  // --------------------------
  departementService = inject(DepartementService);
  regionService = inject(RegionService);
  cdRef = inject(ChangeDetectorRef);
  router = inject(Router);

  // --------------------------
  // Données
  // --------------------------
  departements: any[] = [];
  regions: any[] = [];

  // --------------------------
  // Formulaire ajout
  // --------------------------
  showAddForm = false;

  newDepartement = {
    name: '',
    regionId: ''
  };

  // --------------------------
  // Notifications globales
  // --------------------------
  errorMessage = '';
  successMessage = '';

  // --------------------------
  // Modal d'édition
  // --------------------------
  showEditModal = false;

  editDepartement: any = {
    id: null,
    name: '',
    regionId: ''
  };


  // ============================================================
  // 📌 CHARGEMENT DES DONNÉES
  // ============================================================

  ngOnInit(): void {
    this.loadRegions(); 
  }

  loadRegions() {
    this.regionService.getAll().subscribe({
      next: regions => {
        this.regions = regions;
        

        // Charger les départements après avoir récupéré les régions
        this.loadDepartements();
      },
      error: err => console.error("Erreur récupération régions:", err)
    });
  }

  loadDepartements() {
    this.departementService.getAll().subscribe({
      next: data => {
        this.departements = data.map(dep => {
          return { 
            ...dep, 
            regionName: dep.region ? dep.region.name : 'Région inconnue',
            // S'assurer que les employés sont bien présents (utiliser employes avec 's')
            employes: dep.employes || []
          };
        });
        this.cdRef.detectChanges();
      },
      error: err => console.error("Erreur chargement départements:", err)
    });
  }


  // ============================================================
  // 📌 AJOUT
  // ============================================================

  addDepartement() {
    this.resetMessages();

    const name = this.newDepartement.name.trim();
    const regionId = Number(this.newDepartement.regionId);

    if (!name) return this.showError("Le nom du département est obligatoire !");
    if (!regionId) return this.showError("Veuillez sélectionner une région !");

    // Vérifier existence
    const exists = this.departements.some(
      dep => dep.name.toLowerCase() === name.toLowerCase() && dep.regionId === regionId
    );
    if (exists) {
      return this.showError("Un département avec ce nom existe déjà dans cette région !");
    }

    this.departementService.add({ name }, regionId, this.regions).subscribe({
      next: () => {
        this.showSuccess("Département ajouté avec succès !");
        this.loadDepartements();

        this.newDepartement = { name: '', regionId: '' };

        // Fermer après délai
        setTimeout(() => {
          this.showAddForm = false;
          this.successMessage = '';
        }, 2000);
      },
      error: err => {
        console.error(err);
        this.showError(err.error?.message || "Erreur lors de l'ajout du département.");
      }
    });
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newDepartement = { name: '', regionId: '' };
    this.resetMessages();
  }

  // ============================================================
  // 📌 SUPPRESSION AVEC VÉRIFICATION EMPLOYÉS
  // ============================================================

  deleteDepartement(id: number) {
    
    // Récupérer les détails du département depuis l'API
    this.departementService.getById(id).subscribe({
      next: (departement) => {

        const hasEmployees = departement.employes && departement.employes.length > 0;
        const employeeCount = hasEmployees ? departement.employes.length : 0;

        let confirmMessage = '';
        
        if (hasEmployees) {
          // Message si hasEmployees
          confirmMessage = `⚠️ ATTENTION ⚠️\n\n` +
            `Ce département contient ${employeeCount} employé(s).\n\n` +
            `Si vous supprimez ce département, tous les employés associés perdront leur affectation.\n\n` +
            `Êtes-vous sûr de vouloir continuer ?`;
        } else {
          // Message standard si pas d'employés
          confirmMessage = "Voulez-vous vraiment supprimer ce département ?";
        }

        // Demander confirmation
        if (confirm(confirmMessage)) {
          this.performDelete(id, hasEmployees, employeeCount);
        }
      },
      error: (err) => {
        // En cas d'erreur, on demande quand même confirmation
        if (confirm("Voulez-vous vraiment supprimer ce département ?")) {
          this.performDelete(id, false, 0);
        }
      }
    });
  }

  // Méthode privée pour effectuer la suppression
  private performDelete(id: number, hadEmployees: boolean, employeeCount: number = 0) {
    this.departementService.delete(id).subscribe({
      next: () => {
        if (hadEmployees) {
          this.showSuccess(`Département supprimé. ${employeeCount} employé(s) ont été désaffectés.`);
        } else {
          this.showSuccess("Département supprimé avec succès !");
        }
        this.loadDepartements();
      },
      error: err => {
        console.error("Erreur suppression:", err);
        this.showError("Erreur lors de la suppression du département.");
      }
    });
  }

  // ============================================================
  // 📌 NAVIGATION DÉTAILS
  // ============================================================

  viewDepartementDetails(id: number) {
    this.router.navigate(['/departements', id]);
  }

  // ============================================================
  // 📌 MODAL → ÉDITION
  // ============================================================

  openEditModal(dep: any) {
    this.editDepartement = {
      id: dep.id,
      name: dep.name,
      regionId: dep.region?.id || ''  
    };
    
   
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.resetMessages();
  }

  updateDepartement() {
    this.resetMessages();

    if (!this.editDepartement.id) return;
    if (!this.editDepartement.name.trim()) {
      return this.showError("Le nom du département est obligatoire !");
    }
    if (!this.editDepartement.regionId) {
      return this.showError("Veuillez sélectionner une région !");
    }

    const updated = {
      name: this.editDepartement.name.trim(),
      regionId: Number(this.editDepartement.regionId)
    };

  

    this.departementService.updateDepartement(this.editDepartement.id, updated)
      .subscribe({
        next: () => {
          this.closeEditModal();
          this.showSuccess("Département mis à jour avec succès !");
          this.loadDepartements();
        },
        error: (err) => {
          console.error('Erreur mise à jour:', err);
          this.showError("Erreur lors de la modification.");
        }
      });
  }

  // ============================================================
  // 📌 NOTIFICATIONS
  // ============================================================

  showError(message: string, duration = 3500) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', duration);
  }

  showSuccess(message: string, duration = 3000) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', duration);
  }

  resetMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
  
}