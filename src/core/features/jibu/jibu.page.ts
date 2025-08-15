import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jibu',
  templateUrl: './jibu.page.html',
  styleUrls: ['./jibu.page.scss']
})
export class JibuPage implements OnInit {
  searchQuery = '';
  partners: any[] = [];
  filteredPartners: any[] = [];
  dropdownVisible = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    sessionStorage.removeItem('selectedPartner');
    this.http.get<any[]>('https://jibumulti.napvibe.com/local/api/partners.php')
      .subscribe({
        next: data => this.partners = data || [],
        error: err => {
          console.error('Failed to fetch partners:', err);
          this.partners = [];
        }
      });
  }

  goToIndex2() {
    this.router.navigateByUrl('/partner/index2'); // adjust route if needed
  }

  onFocus() {
    this.filterDropdown();
    this.dropdownVisible = true;
  }

  filterDropdown() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPartners = this.partners.filter(p => p.name.toLowerCase().includes(query));
  }

  selectPartner(partner: any) {
    sessionStorage.setItem('selectedPartner', JSON.stringify(partner));
    this.router.navigateByUrl('/partner/index'); // adjust route if needed
  }
}

