import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideHttpClient } from '@angular/common/http'; // ✅ Ensure HttpClient is provided

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    provideHttpClient() // ✅ Provide HttpClient for server-side
  ]
};

// Merge both server and client configurations
export const config = mergeApplicationConfig(appConfig, serverConfig);
