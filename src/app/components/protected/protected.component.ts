import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="protected-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Zone Protégée</span>
        </div>
        <h1>Espace Personnel</h1>
        <p class="subtitle">Bienvenue dans votre espace sécurisé</p>
      </div>

      @if (userInfo(); as user) {
        <!-- Profile Card -->
        <div class="profile-section">
          <div class="profile-card">
            <div class="profile-header">
              <div class="avatar-large">
                {{ getInitials(user.fullName) }}
              </div>
              <div class="profile-info">
                <h2>{{ user.fullName }}</h2>
                <p class="username">@{{ user.username }}</p>
              </div>
              <div class="verified-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Vérifié</span>
              </div>
            </div>

            <div class="profile-details">
              <div class="detail-item">
                <div class="detail-icon purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="detail-content">
                  <label>Nom complet</label>
                  <p>{{ user.fullName }}</p>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div class="detail-content">
                  <label>Adresse email</label>
                  <p>{{ user.email }}</p>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                </div>
                <div class="detail-content">
                  <label>Nom d'utilisateur</label>
                  <p>{{ user.username }}</p>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="detail-content">
                  <label>Prénom</label>
                  <p>{{ user.firstName }}</p>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon pink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="detail-content">
                  <label>Nom de famille</label>
                  <p>{{ user.lastName }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Access Section -->
        <div class="quick-access">
          <h3>Accès rapide</h3>
          <div class="access-grid">
            <a routerLink="/employees" class="access-card">
              <div class="access-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="access-content">
                <h4>Employés</h4>
                <p>Gérer les employés</p>
              </div>
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>

            <a routerLink="/departments" class="access-card">
              <div class="access-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div class="access-content">
                <h4>Départements</h4>
                <p>Gérer les départements</p>
              </div>
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>

            <a routerLink="/regions" class="access-card">
              <div class="access-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div class="access-content">
                <h4>Régions</h4>
                <p>Gérer les régions</p>
              </div>
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>

            <a routerLink="/" class="access-card">
              <div class="access-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div class="access-content">
                <h4>Accueil</h4>
                <p>Retour à l'accueil</p>
              </div>
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Security Info -->
        <div class="security-banner">
          <div class="security-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="security-content">
            <h4>Connexion sécurisée</h4>
            <p>Vos données sont protégées par un système d'authentification sécurisé</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .protected-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      min-height: 100vh;
    }

    /* Header */
    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(102, 126, 234, 0.1);
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 50px;
      color: #667eea;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .header-badge svg {
      width: 20px;
      height: 20px;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1a202c;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #718096;
      font-size: 1.1rem;
      margin: 0;
    }

    /* Profile Section */
    .profile-section {
      margin-bottom: 3rem;
    }

    .profile-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 3rem 2rem 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
      position: relative;
    }

    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: white;
      color: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    .profile-info {
      flex: 1;
      color: white;
    }

    .profile-info h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .username {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .verified-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      color: white;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }

    .verified-badge svg {
      width: 20px;
      height: 20px;
    }

    .profile-details {
      padding: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .detail-item:hover {
      background: #f1f5f9;
      transform: translateX(4px);
    }

    .detail-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .detail-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .detail-icon.purple {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .detail-icon.blue {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .detail-icon.green {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .detail-icon.orange {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .detail-icon.pink {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .detail-content {
      flex: 1;
    }

    .detail-content label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #718096;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-content p {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }

    /* Quick Access */
    .quick-access {
      margin-bottom: 3rem;
    }

    .quick-access h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 1.5rem 0;
    }

    .access-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .access-card {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .access-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .access-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .access-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .access-content {
      flex: 1;
    }

    .access-content h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.25rem 0;
    }

    .access-content p {
      font-size: 0.9rem;
      color: #718096;
      margin: 0;
    }

    .access-card .arrow {
      width: 20px;
      height: 20px;
      color: #cbd5e0;
      transition: all 0.3s ease;
    }

    .access-card:hover .arrow {
      color: #667eea;
      transform: translateX(4px);
    }

    /* Security Banner */
    .security-banner {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      padding: 2rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 4px 20px rgba(67, 233, 123, 0.3);
    }

    .security-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .security-icon svg {
      width: 32px;
      height: 32px;
      color: white;
    }

    .security-content h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
    }

    .security-content p {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .protected-container {
        padding: 1rem;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .profile-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 2rem 1rem;
      }

      .avatar-large {
        width: 80px;
        height: 80px;
        font-size: 1.5rem;
      }

      .profile-info h2 {
        font-size: 1.5rem;
      }

      .profile-details {
        grid-template-columns: 1fr;
        padding: 1.5rem;
      }

      .access-grid {
        grid-template-columns: 1fr;
      }

      .security-banner {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ProtectedComponent {
  authService = inject(AuthService);

  userInfo = computed(() => {
    const profile = this.authService.userProfile();
    if (!profile) return null;

    return {
      username: profile['preferred_username'] || 'N/A',
      email: profile['email'] || 'N/A',
      fullName: profile['name'] || 'N/A',
      firstName: profile['given_name'] || 'N/A',
      lastName: profile['family_name'] || 'N/A'
    };
  });

  getInitials(name: string): string {
    if (!name || name === 'N/A') return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
