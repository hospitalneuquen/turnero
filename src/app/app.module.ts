// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Globales
// import { PlexModule } from '@andes/plex';
// import { Plex } from '@andes/plex';
// import { Server } from '@andes/shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Servicios
import { TurnosService } from './services/turnos.service';
import { VentanillasService } from './services/ventanillas.service';

// Componentes Front
import { AppComponent } from './app.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { VentanillaComponent } from './components/ventanilla/ventanilla.component';
import { NumeroComponent } from './components/numero/numero.component';
import { RelojComponent } from './components/reloj/reloj.component';
import { MenuComponent } from './components/menu/menu.component';


// Compontentes Back
import { ListaVentanillasComponent } from './components/config/ventanillas.component';
import { PanelVentanillaComponent } from './components/config/panel-ventanilla.component';


// Define the routes
const ROUTES = [
  { path: '', redirectTo: 'turnos', pathMatch: 'full' },
  { path: 'config/turnos', component: TurnosComponent },
  { path: 'monitor', component: MonitorComponent },
  { path: 'ventanilla/:slug', component: VentanillaComponent },
  { path: 'config/ventanillas', component: ListaVentanillasComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TurnosComponent,
    MonitorComponent,
    VentanillaComponent,
    NumeroComponent,
    RelojComponent,
    MenuComponent,
    ListaVentanillasComponent,
    PanelVentanillaComponent
  ],
  imports: [
    // PlexModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot()
  ],
  providers: [
    TurnosService,
    VentanillasService,
    // Plex,
    // Server
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
