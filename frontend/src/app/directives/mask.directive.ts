import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMask]',
})
export class MaskDirective {
  @Input('appMask') maskPattern: string = '';

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target;

    if (this.maskPattern === 'placa') {
      this.applyPlacaMask(input);
    } else if (this.maskPattern === 'ano') {
      this.applyAnoMask(input);
    } else if (this.maskPattern === 'renavam') {
      this.applyRenavamMask(input);
    } else if (this.maskPattern === 'chassi') {
      this.applyChassiMask(input);
    }
  }

  private applyPlacaMask(input: HTMLInputElement): void {
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (value.length > 7) {
      value = value.substring(0, 7);
    }

    this.updateValue(value);
  }

  private applyAnoMask(input: HTMLInputElement): void {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    this.updateValue(value);
  }

  private applyRenavamMask(input: HTMLInputElement): void {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    this.updateValue(value);
  }

  private applyChassiMask(input: HTMLInputElement): void {
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 17) {
      value = value.substring(0, 17);
    }
    this.updateValue(value);
  }

  private updateValue(value: string): void {
    this.control.control?.setValue(value, { emitEvent: false });
    this.el.nativeElement.value = value;
  }
}
