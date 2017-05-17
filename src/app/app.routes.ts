import { ConfigVentanillasComponent } from './components/config/ventanillas.component';
import { VentanillaComponent } from './components/ventanilla/ventanilla.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Define the routes
export const routes: Routes = [
  { path: '', redirectTo: 'turnos', pathMatch: 'full' },
  { path: 'turnos', component: TurnosComponent },
  { path: 'monitor', component: MonitorComponent },
  { path: 'ventanilla/:slug', component: VentanillaComponent },
  { path: 'config/ventanillas', component: ConfigVentanillasComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);