import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService, Project } from '../../../services/project.service';
import { PROFILE } from '../../../profile-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projects: Project[] = [];
  selectedCategory = 'All';
  categories: string[] = [];
  menuOpen = false;
  currentYear = new Date().getFullYear();
  profile = PROFILE;

  skills = [
    { name: 'Angular',    level: 90 },
    { name: 'Shopify',    level: 88 },
    { name: 'Laravel',    level: 85 },
    { name: 'REST API',   level: 85 },
    { name: 'WordPress',  level: 82 },
    { name: 'MySQL',      level: 80 },
    { name: 'PHP',        level: 80 },
    { name: 'TypeScript', level: 78 },
  ];

  experience = [
    {
      role: 'Backend Developer & System Analyst',
      company: 'DPRD Provinsi Sulawesi Tengah',
      period: '2025 — 2026',
      desc: 'Mengembangkan sistem backend dan melakukan analisis sistem untuk kebutuhan digital lembaga perwakilan rakyat Provinsi Sulawesi Tengah.'
    },
    {
      role: 'Web Developer Intern',
      company: 'PT. Imersa Solusi Teknologi',
      period: '2023',
      desc: 'Magang sebagai web developer, terlibat pengembangan aplikasi web berbasis Laravel dan pengerjaan proyek klien perusahaan.'
    },
    {
      role: 'Web Developer Intern',
      company: 'PT. Inter Komunika',
      period: '2023',
      desc: 'Magang web developer dengan fokus pada pengembangan dan pemeliharaan website klien.'
    }
  ];

  education = [
    { school: 'Institut Teknologi Nasional Malang', degree: 'S1 Teknik Informatika', period: '2020 — 2024' },
    { school: 'SMAN 1 Palu',                        degree: 'SMA',                  period: '2017 — 2020' },
    { school: 'SMPN 1 Palu',                        degree: 'SMP',                  period: '2014 — 2017' }
  ];

  constructor(private projectService: ProjectService) {}

  ngOnInit() { this.loadProjects(); }

  loadProjects() {
    this.projects = this.projectService.getProjects();
    const cats = [...new Set(this.projects.map(p => p.category))];
    this.categories = ['All', ...cats];
  }

  get filtered(): Project[] {
    return this.selectedCategory === 'All'
      ? this.projects
      : this.projects.filter(p => p.category === this.selectedCategory);
  }

  selectCategory(cat: string) { this.selectedCategory = cat; }

  getPlaceholder(p: Project) {
    return p.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
