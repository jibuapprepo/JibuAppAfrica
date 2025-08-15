import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-jibu',
  templateUrl: './jibu.html',
  styleUrls: ['./jibu.scss'],
  standalone: true, // ✅ make it standalone
  imports: [
    CommonModule, // for *ngIf, *ngFor
    FormsModule,  // for [(ngModel)]
    IonicModule   // for <ion-*> components
  ]
})
export class JibuPage implements OnInit, OnDestroy {

  // UI model
  identifier = '';
  password = '';
  rememberMe = false;
  loggingIn = false;
  passwordVisible = false;
  errorText = '';

  // Partner theming
  headerLogo = 'https://img.icons8.com/color/48/microsoft-office-2019.png';
  loginTitle = 'Kenyatta University';

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    try {
      const raw = sessionStorage.getItem('selectedPartner') || '{}';
      const partner = JSON.parse(raw);
      if (partner?.maincolor) document.documentElement.style.setProperty('--main-color', partner.maincolor);
      if (partner?.headingcolor) document.documentElement.style.setProperty('--heading-color', partner.headingcolor);
      if (partner?.linkcolor) document.documentElement.style.setProperty('--link-color', partner.linkcolor);
      if (partner?.logo_url) this.headerLogo = partner.logo_url;
      if (partner?.name) {
        this.loginTitle = `${partner.name} <span style="font-weight: normal; font-size: 13px;"> Learning Portal</span>`;
      }
    } catch {}

    window.addEventListener('message', this.onOAuthMessage, false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.onOAuthMessage, false);
  }

  private onOAuthMessage = (event: MessageEvent) => {
    this.zone.run(() => {
      const { provider, email, name, token, error } = (event.data || {}) as any;
      if (error) {
        this.showError(error);
        return;
      }
      if (provider === 'google' && token && email) {
        const userData = { token, email, name, provider };
        localStorage.setItem('jibuLogin', JSON.stringify(userData));
        window.location.href = '/partner/dashboard.html';
      }
    });
  };

  goBack() { history.back(); }
  goToRegistration() { window.location.href = 'registration.html'; }
  exploreCourses() { window.location.href = 'courses.html'; }
  forgotPassword() { alert('Please contact your administrator to reset your password.'); }
  togglePassword() { this.passwordVisible = !this.passwordVisible; }

  private showError(msg: string) { this.errorText = msg; }
  private clearError() { this.errorText = ''; }

  async handleLogin() {
    this.clearError();
    const identifier = this.identifier.trim();
    const password = this.password.trim();

    if (!identifier || !password) { this.showError('Please fill in both identifier and password.'); return; }
    if (identifier.includes('@') && !/^\S+@\S+\.\S+$/.test(identifier)) { this.showError('Please enter a valid email address or username.'); return; }

    this.loggingIn = true;
    try {
      const payload = new URLSearchParams({ username: identifier, password });
      const res = await fetch('https://jibumulti.napvibe.com/login/token.php?service=moodle_mobile_app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
      const data = await res.json();

      if ((data as any).token) {
        const userData = { token: (data as any).token, identifier };
        if (this.rememberMe) localStorage.setItem('jibuLogin', JSON.stringify(userData));
        else sessionStorage.setItem('jibuLogin', JSON.stringify(userData));
        window.location.href = '/partner/dashboard.html';
      } else this.showError((data as any).error || 'Login failed. Please check credentials.');
    } catch { this.showError('Network error. Please try again.'); } 
    finally { this.loggingIn = false; }
  }

  openGoogleOAuth() {
    this.clearError();
    const clientId = '854860788162-0iee0ks4075qhoagmtmm3urmqf1vuklu.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('https://jibumulti.napvibe.com/oauth/google.html');
    const scope = encodeURIComponent('email profile');
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('google_oauth_state', state);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account&state=${encodeURIComponent(state)}`;
    const width = 500, height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(authUrl, 'googleLogin', `width=${width},height=${height},left=${left},top=${top},resizable=yes`);
    if (!popup || popup.closed || typeof popup.closed === 'undefined') this.showError('Popup blocked! Please allow popups and try again.');
  }
}
