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

  employeeService = inject(EmployeeService);
  departmentService = inject(DepartementService);
  regionService = inject(RegionService);
  cdRef = inject(ChangeDetectorRef);

  employees: any[] = [];
  filteredEmployees: any[] = [];
  departments: any[] = [];
  allDepartments: any[] = [];
  regions: any[] = [];

  selectedRegionId: number | null = null;
  selectedDepartementId: number | null = null;

  showAddForm = false;
  showEditModal = false;
  showViewModal = false;

  newEmployeeRegionId: number | null = null;
  editedEmployeeRegionId: number | null = null;

  newEmployee: any = {
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
    phone: '',
    departement: ''
  };

  notification = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  };

  // ============================================================
  ngOnInit() {
    forkJoin({
      regions: this.regionService.getAll(),
      departments: this.departmentService.getAll()
    }).subscribe({
      next: res => {
        this.regions = res.regions;
        this.departments = res.departments;
        this.allDepartments = [...res.departments];
        this.loadEmployees();
      }
    });
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe(data => {
      this.employees = data;
      this.applyFilters();
      this.cdRef.detectChanges();
    });
  }

  // ============================================================
  // FILTERS
  // ============================================================
  applyFilters() {
    this.filteredEmployees = this.employees.filter(emp => {
      if (this.selectedRegionId && emp.departement?.region?.id !== this.selectedRegionId) return false;
      if (this.selectedDepartementId && emp.departement?.id !== this.selectedDepartementId) return false;
      return true;
    });
  }

  resetFilters() {
    this.selectedRegionId = null;
    this.selectedDepartementId = null;
    this.departments = [...this.allDepartments];
    this.applyFilters();
  }

  // ============================================================
  // ADD EMPLOYEE
  // ============================================================
  addEmployee() {
    this.closeNotification();
    this.validateAddForm();

    const hasErrors = Object.values(this.formErrors).some(e => e !== '');
    if (hasErrors) {
      this.showNotification('Veuillez corriger les erreurs.', 'error');
      return;
    }

    const payload = {
      name: this.newEmployee.name.trim(),
      address: this.newEmployee.address.trim(),
      email: this.newEmployee.email.trim().toLowerCase(),
      phone: this.newEmployee.phone.trim(),
      departement: { id: this.newEmployee.departement.id }
    };

    this.employeeService.add(payload).subscribe({
      next: () => {
        this.showNotification('Employé ajouté avec succès !', 'success');
        this.cancelAdd();
        this.loadEmployees();
      },
      error: () => this.showNotification('Erreur lors de l’ajout', 'error')
    });
  }

  cancelAdd() {
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

  validateAddForm() {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    const phoneRegex = /^[0-9+\s\-()]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    this.formErrors.name =
      !this.newEmployee.name ? 'Nom obligatoire'
      : this.newEmployee.name.length < 3 ? 'Min 3 caractères'
      : !nameRegex.test(this.newEmployee.name) ? 'Nom invalide'
      : '';

    this.formErrors.address = !this.newEmployee.address ? 'Adresse obligatoire' : '';
    this.formErrors.email =
      !emailRegex.test(this.newEmployee.email) ? 'Email invalide' : '';
    this.formErrors.phone =
      !phoneRegex.test(this.newEmployee.phone) ? 'Téléphone invalide' : '';
    this.formErrors.departement =
      !this.newEmployee.departement.id ? 'Département obligatoire' : '';
  }

  // ============================================================
  // EDIT EMPLOYEE
  // ============================================================
  editEmployee(id: number) {
    this.employeeService.getById(id).subscribe(emp => {
      this.editedEmployee = {
        id: emp.id,
        name: emp.name,
        address: emp.address,
        email: emp.email,
        phone: emp.phone,
        departement: { id: emp.departement?.id }
      };
      this.showEditModal = true;
    });
  }

  saveEdit() {
    const payload = {
      name: this.editedEmployee.name,
      address: this.editedEmployee.address,
      email: this.editedEmployee.email,
      phone: this.editedEmployee.phone,
      departement: { id: this.editedEmployee.departement.id }
    };

    this.employeeService.update(this.editedEmployee.id, payload).subscribe(() => {
      this.showNotification('Employé modifié', 'success');
      this.loadEmployees();
      this.closeEdit();
    });
  }

  closeEdit() {
    this.showEditModal = false;
  }

  // ============================================================
  // DELETE
  // ============================================================
  deleteEmployee(id: number) {
    if (!confirm('Supprimer cet employé ?')) return;
    this.employeeService.delete(id).subscribe(() => {
      this.showNotification('Employé supprimé', 'success');
      this.loadEmployees();
    });
  }

  // ============================================================
  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification = { show: true, message, type };
    setTimeout(() => this.notification.show = false, 3000);
  }

  closeNotification() {
    this.notification.show = false;
  }
}
