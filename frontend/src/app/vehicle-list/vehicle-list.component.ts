import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/vehicle.model';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  currentVehicleId: number | null = null;
  vehicleIdToDelete: number | null = null;
  vehicleForm: FormGroup;

  constructor(private vehicleService: VehicleService, private fb: FormBuilder) {
    this.vehicleForm = this.fb.group({
      placa: ['', Validators.required],
      chassi: ['', Validators.required],
      renavam: ['', Validators.required],
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      ano: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(1900)],
      ],
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe((data) => {
      this.vehicles = data;
    });
  }

  openModal(): void {
    this.isEditing = false;
    this.currentVehicleId = null;
    this.vehicleForm.reset({ ano: new Date().getFullYear() });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.vehicleForm.reset();
  }

  editVehicle(vehicle: Vehicle): void {
    this.isEditing = true;
    this.currentVehicleId = vehicle.id!;
    this.vehicleForm.patchValue(vehicle);
    this.showModal = true;
  }

  confirmDelete(id: number): void {
    this.vehicleIdToDelete = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.vehicleIdToDelete = null;
  }

  deleteVehicle(): void {
    if (this.vehicleIdToDelete) {
      this.vehicleService
        .deleteVehicle(this.vehicleIdToDelete)
        .subscribe(() => {
          this.loadVehicles();
          this.cancelDelete();
        });
    }
  }

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      const vehicleData = this.vehicleForm.value;

      if (this.isEditing && this.currentVehicleId) {
        this.vehicleService
          .updateVehicle(this.currentVehicleId, vehicleData)
          .subscribe(() => {
            this.loadVehicles();
            this.closeModal();
          });
      } else {
        this.vehicleService.createVehicle(vehicleData).subscribe(() => {
          this.loadVehicles();
          this.closeModal();
        });
      }
    }
  }
}
