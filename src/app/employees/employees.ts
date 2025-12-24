import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeeService } from '../services/employee.service';
import { DepartementService } from '../services/departement.service';
import { RegionService } from '../services/region.service';
import { ReportService, ReportType } from '../services/ReportService';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {




 private reportService = inject(ReportService);



  // ============================================================
  // 🔧 SERVICES
  // ============================================================
  employeeService = inject(EmployeeService);
  departmentService = inject(DepartementService);
  regionService = inject(RegionService);
  cdRef = inject(ChangeDetectorRef);
 route = inject(ActivatedRoute);
  router = inject(Router);
  // ============================================================
  // 📦 DONNÉES
  // ============================================================
  employees: any[] = [];
  filteredEmployees: any[] = [];

  regions: any[] = [];
  departments: any[] = [];        // filtres
  allDepartments: any[] = [];     // formulaires

  // ============================================================
  // 🔎 FILTRES TABLEAU
  // ============================================================
  selectedRegionId: number | null = null;
  selectedDepartementId: number | null = null;

  // ============================================================
  // 🪟 UI / MODALS
  // ============================================================
  showAddForm = false;
  showEditModal = false;
  showViewModal = false;

  // ============================================================
  // ➕ AJOUT
  // ============================================================
  newEmployeeRegionId: number | null = null;

  newEmployee: any = {
    name: '',
    address: '',
    email: '',
    phone: '',
    departement: { id: null }
  };

  // ============================================================
  // ✏️ ÉDITION
  // ============================================================
  editedEmployeeRegionId: number | null = null;

  editedEmployee: any = {
    id: null,
    name: '',
    address: '',
    email: '',
    phone: '',
    departement: { id: null }
  };

  selectedEmployee: any = null;

  // ============================================================
  // ❗ VALIDATION
  // ============================================================
  formErrors: any = {
    name: '',
    address: '',
    email: '',
    phone: '',
    departement: ''
  };

  // ============================================================
  // 🔔 NOTIFICATIONS
  // ============================================================
  notification = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  };

  // ============================================================
  // 🚀 INIT
  // ============================================================
  ngOnInit(): void {
    forkJoin({
      regions: this.regionService.getAll(),
      departments: this.departmentService.getAll()
    }).subscribe({
      next: (res) => {
        this.regions = res.regions;
        this.departments = res.departments;
        this.allDepartments = [...res.departments];
        this.loadEmployees();
      },
      error: () => this.showNotification('Erreur chargement données', 'error')
    });
  }

  // ============================================================
  // 📥 EMPLOYÉS
  // ============================================================
  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilters();
        this.cdRef.detectChanges();
      },
      error: () => this.showNotification('Erreur chargement employés', 'error')
    });
  }

  // ============================================================
  // 🔎 FILTRES - CORRIGÉ AVEC CONVERSION DE TYPE
  // ============================================================
  onRegionChange(): void {
    // Convertir en nombre pour comparaison correcte
    const regionId = this.selectedRegionId ? Number(this.selectedRegionId) : null;
    
    if (!regionId) {
      this.departments = [...this.allDepartments];
    } else {
      this.departments = this.getDepartmentsByRegion(regionId);
    }
    
    this.selectedDepartementId = null;
    this.applyFilters();
  }

  onDepartementChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    // Convertir les IDs en nombres pour comparaison correcte
    const regionId = this.selectedRegionId ? Number(this.selectedRegionId) : null;
    const deptId = this.selectedDepartementId ? Number(this.selectedDepartementId) : null;

    this.filteredEmployees = this.employees.filter(emp => {
      // Filtre par région
      if (regionId && Number(emp.departement?.region?.id) !== regionId) {
        return false;
      }

      // Filtre par département
      if (deptId && Number(emp.departement?.id) !== deptId) {
        return false;
      }

      return true;
    });

    console.log('Filtres appliqués:', {
      regionId,
      deptId,
      totalEmployees: this.employees.length,
      filteredCount: this.filteredEmployees.length
    });
  }

  resetFilters(): void {
    this.selectedRegionId = null;
    this.selectedDepartementId = null;
    this.departments = [...this.allDepartments];
    this.applyFilters();
  }

  // ============================================================
  // 🧭 RÉGION → DÉPARTEMENTS
  // ============================================================
  getDepartmentsByRegion(regionId: number | null): any[] {
    if (!regionId) return this.allDepartments;

    const numRegionId = Number(regionId);
    
    // Chercher d'abord dans la relation region.departements
    const region = this.regions.find(r => Number(r.id) === numRegionId);
    if (region?.departements?.length) {
      return region.departements;
    }

    // Sinon filtrer manuellement
    return this.allDepartments.filter(d => Number(d.region?.id) === numRegionId);
  }

  onNewEmployeeRegionChange(regionId: number | null): void {
    this.newEmployeeRegionId = regionId;
    this.newEmployee.departement.id = null;
  }

  onEditedEmployeeRegionChange(regionId: number | null): void {
    this.editedEmployeeRegionId = regionId;
    if (!this.editedEmployee.departement) {
      this.editedEmployee.departement = {};
    }
    this.editedEmployee.departement.id = null;
  }

  // ============================================================
  // ➕ AJOUT
  // ============================================================
  addEmployee(): void {
    this.validateAddForm();
    if (Object.values(this.formErrors).some(e => e)) {
      this.showNotification('Formulaire invalide', 'error');
      return;
    }

    const payload = {
      ...this.newEmployee,
      email: this.newEmployee.email.toLowerCase(),
      departement: { id: this.newEmployee.departement.id }
    };

    this.employeeService.add(payload).subscribe({
      next: () => {
        this.showNotification('Employé ajouté', 'success');
        this.cancelAdd();
        this.loadEmployees();
      },
      error: () => this.showNotification('Erreur ajout', 'error')
    });
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.newEmployeeRegionId = null;
    this.newEmployee = {
      name: '',
      address: '',
      email: '',
      phone: '',
      departement: { id: null }
    };
    this.formErrors = { name: '', address: '', email: '', phone: '', departement: '' };
  }

  validateAddForm(): void {
    this.formErrors = { name: '', address: '', email: '', phone: '', departement: '', region: ''};

    if (!this.newEmployee.name || this.newEmployee.name.length < 3)
      this.formErrors.name = 'Nom invalide (min. 3 caractères)';

    if (!this.newEmployee.address)
      this.formErrors.address = 'Adresse obligatoire';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newEmployee.email))
      this.formErrors.email = 'Email invalide';

    if (!/^[0-9+\s\-()]{8,}$/.test(this.newEmployee.phone))
      this.formErrors.phone = 'Téléphone invalide (min. 8 chiffres)';

    if (!this.newEmployee.departement.id)
      this.formErrors.departement = 'Département obligatoire';

     if (!this.newEmployeeRegionId)  
    this.formErrors.region = 'Région obligatoire';
  }

  // ============================================================
  // ✏️ ÉDITION
  // ============================================================
  editEmployee(id: number): void {
    this.employeeService.getById(id).subscribe({
      next: emp => {
        this.editedEmployee = {
          id: emp.id,
          name: emp.name,
          address: emp.address,
          email: emp.email,
          phone: emp.phone,
          departement: { id: emp.departement?.id ?? null }
        };

        // Trouver la région du département actuel
        const dept = this.allDepartments.find(d => Number(d.id) === Number(emp.departement?.id));
        this.editedEmployeeRegionId = dept?.region?.id ?? null;

        this.showEditModal = true;
        this.cdRef.detectChanges();
      },
      error: () => this.showNotification('Erreur chargement employé', 'error')
    });
  }

  saveEdit(): void {
    if (!this.editedEmployee.name || !this.editedEmployee.email) {
      this.showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }

    this.employeeService.update(this.editedEmployee.id, this.editedEmployee).subscribe({
      next: () => {
        this.showNotification('Employé modifié', 'success');
        this.loadEmployees();
        this.closeEdit();
      },
      error: () => this.showNotification('Erreur modification', 'error')
    });
  }

  closeEdit(): void {
    this.showEditModal = false;
    this.editedEmployeeRegionId = null;
  }

  // ============================================================
  // 🗑️ SUPPRESSION
  // ============================================================
  deleteEmployee(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;

    this.employeeService.delete(id).subscribe({
      next: () => {
        this.showNotification('Employé supprimé', 'success');
        this.loadEmployees();
      },
      error: () => this.showNotification('Erreur suppression', 'error')
    });
  }

  // ============================================================
  // 🔔 NOTIFICATIONS
  // ============================================================
  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.notification = { show: true, message, type };
    setTimeout(() => this.notification.show = false, 3000);
  }

  closeNotification(): void {
    this.notification.show = false;
  }
  goToReport() {
    this.router.navigate(['employe/report']);
  }


  // Télécharger le PDF filtré
  downloadEmployeeReport(): void {
    this.reportService.downloadReport(
      ReportType.EMPLOYE,
      this.selectedRegionId,
      this.selectedDepartementId
    ).subscribe({
      next: (blob: Blob) => this.downloadBlob(blob, 'employes'),
      error: () => this.showNotification('Erreur lors du téléchargement du PDF', 'error')
    });
  }

  private downloadBlob(blob: Blob, filenamePrefix: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filenamePrefix}_report_${new Date().getTime()}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.showNotification('Rapport téléchargé avec succès !', 'success');
  }

}