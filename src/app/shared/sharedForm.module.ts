import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

/**
 * SharedFormsModule
 * Modulo que contem toda a abstração de formulários, tanto campos, quando validações e botões
 */
export const SharedFormsModule = [
  ReactiveFormsModule,
  FormsModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatIcon,  
];
