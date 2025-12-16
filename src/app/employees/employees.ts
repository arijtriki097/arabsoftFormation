import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { DepartementService } from '../services/departement.service';
import { RegionService } from '../services/region.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {
 
  // SERVICES
  
  employeeService = inject(EmployeeService);
  departmentService = inject(DepartementService);
  regionService = inject(RegionService);
  cdRef = inject(ChangeDetectorRef);

  
  // DONNÉES
  
  employees: any[] = [];
  filteredEmployees: any[] = [];
  departments: any[] = [];        // Pour les filtres 
  allDepartments: any[] = [];     // Pour les formulaires 
  regions: any[] = [];

  
  // FILTRES
  
  selectedRegionId: number | null = null;
  selectedDepartementId: number | null = null;
  searchTerm: string = '';

  
  // MODALS & FORMS
 
  showAddForm = false;
  showEditModal = false;
  showViewModal = false;
  
  // ✅ PROPRIÉTÉS MANQUANTES (causes des erreurs TS2339)
  newEmployeeRegionId: number | null = null;
  editedEmployeeRegionId: number | null = null;

  newEmployee: any = {
    id: null,
    name: '',
    address: '',
    email: '',
    phone: '',
    departement: { id: null }
  };

  editedEmployee: any = {
    id: null,
    name: '',
    address: '',
    email: '',
    phone: '',
    departement: { id: null }
  };

  selectedEmployee: any = null;


  formErrors: any = {
    name: '',
    address: '',
    email: '',
    phone: ''
  };
  // ============================================================
  // 📌 NOTIFICATION SYSTEM
  // ============================================================
  notification: { 
    show: boolean; 
    message: string; 
    type: 'success' | 'error' | 'info' 
  } = {
    show: false,
    message: '',
    type: 'success'
  };

  // ============================================================
  // 📌 INITIALISATION
  // ============================================================
  ngOnInit() {
    // Charger les régions et départements en premier, puis les employés
    forkJoin({
      regions: this.regionService.getAll(),
      departments: this.departmentService.getAll()
    }).subscribe({
      next: (result) => {
        this.regions = result.regions;
        this.departments = result.departments;
        this.allDepartments = [...result.departments];
        
        // Maintenant charger les employés
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Erreur chargement données:', err);
        this.showNotification('Erreur lors du chargement des données', 'error');
      }
    });
  }

  // ============================================================
  // 📌 CHARGEMENT DES DONNÉES
  // ============================================================
  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.cdRef.detectChanges();
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des employés:', err);
        this.showNotification('Erreur lors du chargement des employés', 'error');
      }
    });
  }

  // ============================================================
  // 📌 FILTRAGE DANS LE TABLEAU (EXISTANT)
  // ============================================================
  onRegionChange() {
    if (this.selectedRegionId) {
      const region = this.regions.find(r => r.id == this.selectedRegionId);
      
      if (region && region.departements && region.departements.length > 0) {
        this.departments = region.departements;
      } else {
        this.departments = this.allDepartments.filter(dept => 
          dept.region && dept.region.id == this.selectedRegionId
        );
      }
      
      this.selectedDepartementId = null;
    } else {
      this.departments = [...this.allDepartments];
      this.selectedDepartementId = null;
    }
    this.applyFilters();
  }

  onDepartementChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredEmployees = this.employees.filter(emp => {
      let match = true;

      if (this.selectedRegionId) {
        match = match && emp.departement?.region?.id == this.selectedRegionId;
      }

      if (this.selectedDepartementId) {
        match = match && emp.departement?.id == this.selectedDepartementId;
      }

      return match;
    });
  }

  resetFilters() {
    this.selectedRegionId = null;
    this.selectedDepartementId = null;
    this.departments = [...this.allDepartments];
    this.applyFilters();
  }

  // ============================================================
  // 📌 GESTION DES DÉPARTEMENTS ET RÉGIONS DANS LES FORMULAIRES 
  // ============================================================

  // ✅ MÉTHODE MANQUANTE
  onNewEmployeeRegionChange(regionId: number | null) {
      this.newEmployeeRegionId = regionId;
      // Réinitialiser le département lors du changement de région
      this.newEmployee.departement.id = null; 
      // Si on valide le formulaire après ça, le département sera considéré manquant s'il est requis
      this.validateAddForm();
  }

  // ✅ MÉTHODE MANQUANTE
  onEditedEmployeeRegionChange(regionId: number | null) {
      this.editedEmployeeRegionId = regionId;
      // Réinitialiser le département de l'employé si la région change
      if (this.editedEmployee.departement) {
          this.editedEmployee.departement.id = null;
      }
  }

  // ✅ MÉTHODE MANQUANTE
  getDepartmentsByRegion(regionId: number | null): any[] {
      if (!regionId) {
          // Retourne tous les départements si aucune région n'est sélectionnée
          return this.allDepartments;
      }

      // Tente de trouver la région pour potentiellement utiliser les données imbriquées
      const region = this.regions.find(r => r.id == regionId);
      
      // Si la région existe et contient des départements (structure hiérarchique)
      if (region && region.departements && region.departements.length > 0) {
          return region.departements;
      }

      // Sinon, filtre à partir de la liste complète de départements (structure plate)
      return this.allDepartments.filter(dept => 
          dept.region && dept.region.id == regionId
      );
  }

  // ============================================================
  // 📌 AJOUT D'EMPLOYÉ AVEC VALIDATIONS
  // ============================================================
  addEmployee() {
    // Réinitialiser les messages
    this.closeNotification();

<<<<<<< HEAD
    // Effectuer une validation complète avant l'envoi
    this.validateAddForm();
=======
    // ✅ Validation du téléphone
    if (!this.newEmployee.phone || this.newEmployee.phone.trim().length === 0) {
      this.showNotification('Le téléphone est obligatoire', 'error');
      return;
    }

    const phoneRegex = /^[0-9+\s\-()]{8,}$/;
    if (!phoneRegex.test(this.newEmployee.phone.trim())) {
      this.showNotification('Format de téléphone invalide (minimum 8 chiffres)', 'error');
      return;
    }
//departement
   if (this.newEmployee.departement.id && !this.allDepartments.some(d => d.id == this.newEmployee.departement.id)) {
  this.showNotification('Département invalide', 'error');
  return;
}

    // ✅ Tout est valide, procéder à l'ajout
    const employeeToSend = {
      name: this.newEmployee.name.trim(),
      address: this.newEmployee.address.trim(),
      email: this.newEmployee.email.trim().toLowerCase(),
      phone: this.newEmployee.phone.trim(),
      departement: this.newEmployee.departement?.id ? { id: this.newEmployee.departement.id } : null
    };

    this.employeeService.add(employeeToSend).subscribe({
      next: () => {
        this.showNotification('Employé ajouté avec succès !', 'success');
        this.cancelAdd();
        
        setTimeout(() => {
          this.loadEmployees();
        }, 100);
      },
      error: (err) => {
        console.error('Erreur ajout:', err);
        this.showNotification(
          err.error?.message || 'Erreur lors de l\'ajout de l\'employé',
          'error'
        );
      }
    });
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newEmployee = { 
      id: null,
      name: '', 
      address: '', 
      email: '', 
      phone: '', 
      departement: { id: null } 
    };
  }
      validateAddForm() {
        // Nom
              const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/; 
          if (!this.newEmployee.name || this.newEmployee.name.trim() === '') {
            this.formErrors.name = 'Le nom est obligatoire';
          } else if (this.newEmployee.name.trim().length < 3) {
            this.formErrors.name = 'Le nom doit contenir au moins 3 caractères';
          } else if (!nameRegex.test(this.newEmployee.name.trim())) {
            this.formErrors.name = 'Le nom ne doit contenir que des lettres';
          } else {
            this.formErrors.name = '';
          }

        // Adresse
        if (!this.newEmployee.address || this.newEmployee.address.trim() === '') {
          this.formErrors.address = 'L\'adresse est obligatoire';
        } else {
          this.formErrors.address = '';
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.newEmployee.email || this.newEmployee.email.trim() === '') {
          this.formErrors.email = 'L\'email est obligatoire';
        } else if (!emailRegex.test(this.newEmployee.email)) {
          this.formErrors.email = 'Format d\'email invalide';
        } else if (this.employees.some(emp => emp.email.toLowerCase() === this.newEmployee.email.toLowerCase())) {
          this.formErrors.email = 'Cet email est déjà utilisé';
        } else {
          this.formErrors.email = '';
        }

        // Téléphone
        const phoneRegex = /^[0-9+\s\-()]{8,}$/;
        if (!this.newEmployee.phone || this.newEmployee.phone.trim() === '') {
          this.formErrors.phone = 'Le téléphone est obligatoire';
        } else if (!phoneRegex.test(this.newEmployee.phone.trim())) {
          this.formErrors.phone = 'Format de téléphone invalide (minimum 8 chiffres)';
        } else {
          this.formErrors.phone = '';
        }

        //  Validation du département
        if (!this.newEmployee.departement?.id) {
          this.formErrors.departement = 'Le département est obligatoire';
          return;
        } else {
          this.formErrors.departement = '';
        }


      }

  // ============================================================
  // 📌 MODIFICATION D'EMPLOYÉ AVEC VALIDATIONS
  // ============================================================
  editEmployee(id: number) {
    this.showViewModal = false;
    this.selectedEmployee = null;
>>>>>>> 89945c38d57db64dc73d4b119559d92eaadbf658
    
    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(this.formErrors).some(error => error !== '');
    if (hasErrors) {
        this.showNotification('Veuillez corriger les erreurs dans le formulaire.', 'error');
        return;
    }


    // ✅ Tout est valide, procéder à l'ajout
    const employeeToSend = {
      name: this.newEmployee.name.trim(),
      address: this.newEmployee.address.trim(),
      email: this.newEmployee.email.trim().toLowerCase(),
      phone: this.newEmployee.phone.trim(),
      departement: this.newEmployee.departement?.id ? { id: this.newEmployee.departement.id } : null
    };

    this.employeeService.add(employeeToSend).subscribe({
      next: () => {
        this.showNotification('Employé ajouté avec succès !', 'success');
        this.cancelAdd();
        
        setTimeout(() => {
          this.loadEmployees();
        }, 100);
      },
      error: (err) => {
        console.error('Erreur ajout:', err);
        this.showNotification(
          err.error?.message || 'Erreur lors de l\'ajout de l\'employé',
          'error'
        );
      }
    });
  }

  cancelAdd() {
    this.showAddForm = false;
    // ✅ Réinitialiser la région également
    this.newEmployeeRegionId = null; 
    this.newEmployee = { 
      id: null,
      name: '', 
      address: '', 
      email: '', 
      phone: '', 
      departement: { id: null } 
    };
    // Réinitialiser les erreurs
    this.formErrors = { name: '', address: '', email: '', phone: '', departement: '' }; 
  }
    
    validateAddForm() {
        // Nom
              const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/; 
          if (!this.newEmployee.name || this.newEmployee.name.trim() === '') {
            this.formErrors.name = 'Le nom est obligatoire';
          } else if (this.newEmployee.name.trim().length < 3) {
            this.formErrors.name = 'Le nom doit contenir au moins 3 caractères';
          } else if (!nameRegex.test(this.newEmployee.name.trim())) {
            this.formErrors.name = 'Le nom ne doit contenir que des lettres';
          } else {
            this.formErrors.name = '';
          }

        // Adresse
        if (!this.newEmployee.address || this.newEmployee.address.trim() === '') {
          this.formErrors.address = 'L\'adresse est obligatoire';
        } else {
          this.formErrors.address = '';
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.newEmployee.email || this.newEmployee.email.trim() === '') {
          this.formErrors.email = 'L\'email est obligatoire';
        } else if (!emailRegex.test(this.newEmployee.email)) {
          this.formErrors.email = 'Format d\'email invalide';
        } else if (this.employees.some(emp => emp.email.toLowerCase() === this.newEmployee.email.toLowerCase())) {
          this.formErrors.email = 'Cet email est déjà utilisé';
        } else {
          this.formErrors.email = '';
        }

        // Téléphone
        const phoneRegex = /^[0-9+\s\-()]{8,}$/;
        if (!this.newEmployee.phone || this.newEmployee.phone.trim() === '') {
          this.formErrors.phone = 'Le téléphone est obligatoire';
        } else if (!phoneRegex.test(this.newEmployee.phone.trim())) {
          this.formErrors.phone = 'Format de téléphone invalide (minimum 8 chiffres)';
        } else {
          this.formErrors.phone = '';
        }

        //  Validation du département
        if (!this.newEmployee.departement?.id) {
          this.formErrors.departement = 'Le département est obligatoire';
          // Si un ID est présent, vérifier qu'il est valide
        } else if (!this.allDepartments.some(d => d.id == this.newEmployee.departement.id)) {
          this.formErrors.departement = 'Département invalide';
        } else {
          this.formErrors.departement = '';
        }
      }

  // ============================================================
  // 📌 MODIFICATION D'EMPLOYÉ AVEC LOGIQUE REGION (MODIFIÉ)
  // ============================================================
 editEmployee(id: number) {
  this.showViewModal = false;
  this.selectedEmployee = null;
  this.closeNotification();
  this.editedEmployeeRegionId = null;

  this.employeeService.getById(id).subscribe({
    next: (emp) => {

      this.editedEmployee = {
        id: emp.id,
        name: emp.name,
        address: emp.address,
        email: emp.email,
        phone: emp.phone,
        departement: emp.departement
          ? { id: emp.departement.id }
          : { id: null }
      };

      // ✅ RÉCUPÉRATION DE LA RÉGION À PARTIR DU DÉPARTEMENT
      const dept = this.allDepartments.find(d => d.id === emp.departement?.id);
      this.editedEmployeeRegionId = dept?.region?.id ?? null;

      this.showEditModal = true;
      this.cdRef.detectChanges();
    },
    error: () => {
      this.showNotification(
        'Erreur lors du chargement de l\'employé',
        'error'
      );
    }
  });
}

  saveEdit() {
    this.closeNotification();

    if (!this.editedEmployee) return;

    // ✅ Validation du nom
    if (!this.editedEmployee.name || this.editedEmployee.name.trim().length === 0) {
      this.showNotification('Le nom est obligatoire', 'error');
      return;
    }

    if (this.editedEmployee.name.trim().length < 3) {
      this.showNotification('Le nom doit contenir au moins 3 caractères', 'error');
      return;
    }

    // ✅ Validation de l'adresse
    if (!this.editedEmployee.address || this.editedEmployee.address.trim().length === 0) {
      this.showNotification('L\'adresse est obligatoire', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editedEmployee.email)) {
      this.showNotification('Format d\'email invalide', 'error');
      return;
    }
    
    // ✅ Validation du département (vérifier si un ID est présent, sinon alerte)
    if (this.editedEmployee.departement?.id && !this.allDepartments.some(d => d.id == this.editedEmployee.departement.id)) {
        this.showNotification('Département sélectionné invalide.', 'error');
        return;
    }

    // ✅ Validation du téléphone
    if (!this.editedEmployee.phone || this.editedEmployee.phone.trim().length === 0) {
      this.showNotification('Le téléphone est obligatoire', 'error');
      return;
    }

    const phoneRegex = /^[0-9+\s\-()]{8,}$/;
    if (!phoneRegex.test(this.editedEmployee.phone.trim())) {
      this.showNotification('Format de téléphone invalide (minimum 8 chiffres)', 'error');
      return;
    }

    // ✅ Tout est valide, procéder à la modification
    const employeeToSend = {
      name: this.editedEmployee.name.trim(),
      address: this.editedEmployee.address.trim(),
      email: this.editedEmployee.email.trim().toLowerCase(),
      phone: this.editedEmployee.phone.trim(),
      departement: this.editedEmployee.departement?.id ? { id: this.editedEmployee.departement.id } : null
    };

    this.employeeService.update(this.editedEmployee.id, employeeToSend).subscribe({
      next: () => {
        this.showNotification('Employé modifié avec succès !', 'success');
        this.loadEmployees();
        this.closeEdit();
      },
      error: (err) => {
        console.error('Erreur update:', err);
        this.showNotification(
          err.error?.message || 'Erreur lors de la modification',
          'error'
        );
      }
    });
  }

  closeEdit() {
    this.showEditModal = false;
    // ✅ Réinitialiser la région de l'édition
    this.editedEmployeeRegionId = null;
    this.editedEmployee = {
      id: null,
      name: '',
      address: '',
      email: '',
      phone: '',
      departement: { id: null }
    };
  }

  // ============================================================
  // 📌 SUPPRESSION
  // ============================================================
  deleteEmployee(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer cet employé ?")) return;

    this.employeeService.delete(id).subscribe({
      next: () => {
        this.showNotification('Employé supprimé avec succès !', 'success');
        this.loadEmployees();
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Erreur lors de la suppression', 'error');
      }
    });
  }

  // ============================================================
  // 📌 NOTIFICATIONS
  // ============================================================
  showNotification(message: string, type: 'success' | 'error' | 'info') {
    console.log('🔔 Notification appelée:', message, type); 
    this.notification = { show: true, message, type };
    console.log('📊 État notification:', this.notification); 
    
    // Auto-fermeture après 3 secondes
    setTimeout(() => {
      this.notification.show = false;
      console.log('❌ Notification fermée'); 
    }, 3000);
  }

  closeNotification() {
    console.log('👆 Fermeture manuelle');
    this.notification.show = false;
  }

  // ============================================================
  // 📌 HELPERS
  // ============================================================
  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  closeView() {
    this.showViewModal = false;
    this.selectedEmployee = null;
  }
}