import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span>Plateforme de Gestion</span>
          </div>

          <h1 class="hero-title">
            Gérez votre entreprise
            <span class="gradient-text">efficacement</span>
          </h1>

          <p class="hero-description">
            Une solution complète pour la gestion des employés, départements et régions.
            Centralisez toutes vos données et optimisez votre organisation.
          </p>

          <div class="hero-actions">
            <button *ngIf="!authService.isAuthenticated()"
                    (click)="login()"
                    class="btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Se connecter
            </button>

            <a *ngIf="authService.isAuthenticated()"
               routerLink="/employees"
               class="btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Accéder au tableau de bord
            </a>

            <a href="#features" class="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 16 16 12 12 8"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              En savoir plus
            </a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="floating-card card-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <div>
              <h4>Employés</h4>
              <p>Gestion complète</p>
            </div>
          </div>

          <div class="floating-card card-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <div>
              <h4>Départements</h4>
              <p>Organisation optimale</p>
            </div>
          </div>

          <div class="floating-card card-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <div>
              <h4>Régions</h4>
              <p>Vue d'ensemble</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features">
        <div class="section-header">
          <h2>Fonctionnalités principales</h2>
          <p>Tout ce dont vous avez besoin pour gérer efficacement votre organisation</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Gestion des employés</h3>
            <p>Centralisez toutes les informations de vos employés : coordonnées, départements, et plus encore.</p>
            <a routerLink="/employees" class="feature-link">
              Explorer
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>

          <div class="feature-card">
            <div class="feature-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <h3>Organisation par départements</h3>
            <p>Structurez votre entreprise par départements et facilitez la gestion des équipes.</p>
            <a routerLink="/departments" class="feature-link">
              Explorer
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>

          <div class="feature-card">
            <div class="feature-icon orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3>Gestion des régions</h3>
            <p>Gérez votre présence géographique et organisez vos opérations par région.</p>
            <a routerLink="/regions" class="feature-link">
              Explorer
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h3>Interface intuitive</h3>
            <p>Design moderne et facile à utiliser</p>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Sécurisé</h3>
            <p>Vos données sont protégées</p>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <h3>Performant</h3>
            <p>Réponses rapides et fiables</p>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3>Disponible 24/7</h3>
            <p>Accédez où que vous soyez</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta" *ngIf="!authService.isAuthenticated()">
        <div class="cta-content">
          <h2>Prêt à commencer ?</h2>
          <p>Connectez-vous dès maintenant et découvrez toutes les fonctionnalités de notre plateforme.</p>
          <button (click)="login()" class="btn-large">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Se connecter maintenant
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    }

    /* Hero Section - RÉDUIT */
    .hero {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 2rem; /* Réduit de 4rem à 2rem */
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem; /* Réduit de 4rem à 2rem */
      align-items: center;
      min-height: 60vh; /* Réduit de 80vh à 60vh */
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem; /* Réduit de 2rem à 1.25rem */
    }

    .hero-badge {
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
      width: fit-content;
    }

    .hero-badge svg {
      width: 20px;
      height: 20px;
    }

    .hero-title {
      font-size: 3rem; /* Réduit de 3.5rem à 3rem */
      font-weight: 800;
      line-height: 1.2;
      color: #1a202c;
      margin: 0;
    }

    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.1rem; /* Réduit de 1.25rem à 1.1rem */
      color: #718096;
      line-height: 1.6;
      margin: 0;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary, .btn-large {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.75rem; /* Réduit de 1rem 2rem */
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem; /* Réduit de 1rem */
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .btn-primary svg, .btn-secondary svg {
      width: 20px;
      height: 20px;
    }

    /* Hero Visual - RÉDUIT */
    .hero-visual {
      position: relative;
      height: 400px; /* Réduit de 500px à 400px */
    }

    .floating-card {
      position: absolute;
      background: white;
      padding: 1.25rem; /* Réduit de 1.5rem */
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: float 6s ease-in-out infinite;
    }

    .floating-card svg {
      width: 36px; /* Réduit de 40px */
      height: 36px;
      padding: 0.65rem; /* Réduit de 0.75rem */
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .floating-card h4 {
      margin: 0 0 0.25rem 0;
      color: #2d3748;
      font-size: 1rem; /* Réduit de 1.1rem */
    }

    .floating-card p {
      margin: 0;
      color: #718096;
      font-size: 0.85rem; /* Réduit de 0.9rem */
    }

    .card-1 {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .card-2 {
      top: 45%;
      right: 10%;
      animation-delay: 2s;
    }

    .card-3 {
      bottom: 10%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    /* Features Section - RÉDUIT */
    .features {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem; /* Réduit de 6rem à 3rem */
    }

    .section-header {
      text-align: center;
      margin-bottom: 2.5rem; /* Réduit de 4rem à 2.5rem */
    }

    .section-header h2 {
      font-size: 2.25rem; /* Réduit de 2.5rem */
      font-weight: 800;
      color: #1a202c;
      margin: 0 0 0.75rem 0; /* Réduit de 1rem */
    }

    .section-header p {
      font-size: 1rem; /* Réduit de 1.1rem */
      color: #718096;
      margin: 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Réduit de 320px */
      gap: 1.5rem; /* Réduit de 2rem */
    }

    .feature-card {
      background: white;
      padding: 1.75rem; /* Réduit de 2rem */
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      width: 56px; /* Réduit de 64px */
      height: 56px;
      border-radius: 14px; /* Réduit de 16px */
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem; /* Réduit de 1.5rem */
    }

    .feature-icon svg {
      width: 28px; /* Réduit de 32px */
      height: 28px;
      color: white;
    }

    .feature-icon.purple {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .feature-icon.blue {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .feature-icon.orange {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .feature-card h3 {
      font-size: 1.35rem; /* Réduit de 1.5rem */
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.875rem 0; /* Réduit de 1rem */
    }

    .feature-card p {
      color: #718096;
      line-height: 1.6;
      margin: 0 0 1.25rem 0; /* Réduit de 1.5rem */
    }

    .feature-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      transition: gap 0.3s ease;
    }

    .feature-link:hover {
      gap: 0.75rem;
    }

    .feature-link svg {
      width: 16px;
      height: 16px;
    }

    /* Stats Section - RÉDUIT */
    .stats {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2.5rem 2rem; /* Réduit de 4rem à 2.5rem */
    }

    .stats-grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Réduit de 250px */
      gap: 1.5rem; /* Réduit de 2rem */
    }

    .stat-card {
      text-align: center;
      color: white;
    }

    .stat-icon {
      width: 56px; /* Réduit de 64px */
      height: 56px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 14px; /* Réduit de 16px */
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.875rem; /* Réduit de 1rem */
    }

    .stat-icon svg {
      width: 28px; /* Réduit de 32px */
      height: 28px;
    }

    .stat-card h3 {
      font-size: 1.35rem; /* Réduit de 1.5rem */
      font-weight: 700;
      margin: 0 0 0.4rem 0; /* Réduit de 0.5rem */
    }

    .stat-card p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.95rem;
    }

    /* CTA Section - RÉDUIT */
    .cta {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem; /* Réduit de 6rem à 3rem */
    }

    .cta-content {
      background: white;
      padding: 2.5rem; /* Réduit de 4rem à 2.5rem */
      border-radius: 24px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .cta-content h2 {
      font-size: 2.25rem; /* Réduit de 2.5rem */
      font-weight: 800;
      color: #1a202c;
      margin: 0 0 0.875rem 0; /* Réduit de 1rem */
    }

    .cta-content p {
      font-size: 1rem; /* Réduit de 1.1rem */
      color: #718096;
      margin: 0 0 1.75rem 0; /* Réduit de 2rem */
    }

    .btn-large {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.125rem 2.25rem; /* Réduit de 1.25rem 2.5rem */
      font-size: 1rem; /* Réduit de 1.1rem */
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-large:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
    }

    .btn-large svg {
      width: 22px; /* Réduit de 24px */
      height: 22px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2rem;
      }

      .hero-visual {
        height: 350px;
      }

      .hero-title {
        font-size: 2.25rem;
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 1.75rem;
      }

      .hero-description {
        font-size: 0.95rem;
      }

      .section-header h2 {
        font-size: 1.75rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .cta-content {
        padding: 1.75rem;
      }

      .cta-content h2 {
        font-size: 1.5rem;
      }

      .hero-actions {
        flex-direction: column;
      }

      .hero-actions a,
      .hero-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HomeComponent {
  authService = inject(AuthService);
  router = inject(Router);

  async login() {
    await this.authService.login();
    this.router.navigate(['/']);
  }
}