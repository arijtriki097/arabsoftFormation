import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegionService } from '../services/region.service';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regions.html',
  styleUrls: ['./regions.css']
})
export class RegionsComponent implements OnInit {

  regionService = inject(RegionService);
  cdRef = inject(ChangeDetectorRef);
  router = inject(Router);

  regions: any[] = [];
  showAddForm = false;
  newRegion: any = { name: '' };

  ngOnInit() {
    this.loadRegions();
  }

  loadRegions() {
    this.regionService.getAll().subscribe({
      next: (data) => {
        this.regions = data;
        this.cdRef.detectChanges();
      },
      error: (err) => console.error("Erreur load regions:", err)
    });
  }

  addRegion() {
    if (!this.newRegion.name.trim()) {
      alert("Le nom de la région est obligatoire");
      return;
    }

    this.regionService.add(this.newRegion).subscribe({
      next: () => {
        this.loadRegions();
        this.cancelAdd();
      },
      error: (err) => console.error("Erreur ajout région:", err)
    });
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newRegion = { name: '' };
  }

  deleteRegion(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer cette région ?")) return;

    this.regionService.delete(id).subscribe({
      next: () => this.loadRegions(),
      error: (err) => console.error("Erreur suppression région:", err)
    });
  }

  viewRegionDetails(id: number) {
    this.router.navigate(['/regions', id]);
  }
}