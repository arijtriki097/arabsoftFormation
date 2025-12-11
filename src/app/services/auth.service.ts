import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

 login(): Promise<void> {
  return this.keycloak.login();
}

logout(): Promise<void> {
  return this.keycloak.logout(window.location.origin);
}

  isAuthenticated() {
    return this.keycloak.isLoggedIn();
  }

  userProfile() {
    return this.keycloak.getKeycloakInstance()?.tokenParsed;
  }

  refreshProfile() {
    return this.keycloak.loadUserProfile();
  }

  getUserRoles(): string[] {
    const token = this.keycloak.getKeycloakInstance()?.tokenParsed as any;

    if (!token) {
      return [];
    }

    // Récupérer les rôles du realm
    const realmRoles = token.realm_access?.roles || [];

    // Récupérer les rôles du client
    const clientRoles = token.resource_access?.['frontArabsof']?.roles || [];

    // Combiner tous les rôles
    return [...realmRoles, ...clientRoles];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }
}
