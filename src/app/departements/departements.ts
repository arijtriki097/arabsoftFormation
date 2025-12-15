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
  // Modal d’édition
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
      console.log("Régions récupérées :", this.regions);

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
          regionName: dep.region ? dep.region.name : 'Région inconnue'
        };
      });

      // Vérification console
      this.departements.forEach(dep => {
        console.log(`Département: ${dep.name}, Région: ${dep.regionName}`);
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
  // 📌 SUPPRESSION
  // ============================================================

  deleteDepartement(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer ce département ?")) return;

    this.departementService.delete(id).subscribe({
      next: () => this.loadDepartements(),
      error: err => console.error("Erreur suppression:", err)
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
  
  console.log('Édition département:', this.editDepartement); 
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
    regionId: Number(this.editDepartement.regionId)  // Convertir en nombre
  };

  console.log('Envoi mise à jour:', updated); 

  this.departementService.updateDepartement(this.editDepartement.id, updated)
    .subscribe({
      next: () => {
        // FERMER LE MODAL IMMÉDIATEMENT
        this.closeEditModal();
        
        // AFFICHER LE MESSAGE APRÈS
        this.showSuccess("Département mis à jour avec succès !");
        
        // RECHARGER LES DONNÉES
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
