import { environment } from './../environments/environment';
import { Component, OnInit, ModuleWithProviders } from '@angular/core';
// import { Plex } from '@andes/plex';
// import { Server } from '@andes/shared';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  // constructor(public server: Server) {
  //     // Configura server. Debería hacerse desde un provider (http://stackoverflow.com/questions/39033835/angularjs2-preload-server-configuration-before-the-application-starts)
  //   server.setBaseURL(environment.API);
  // }

}
