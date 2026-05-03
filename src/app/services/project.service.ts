import { Injectable } from '@angular/core';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  year: number;
  client?: string;
  link?: string;
}

const DEFAULTS: Project[] = [
  {
    id: '1', title: 'Bassics — Shopify Store',
    description: 'Membangun dan mengkustomisasi toko Shopify untuk brand fashion lokal Bassics, mencakup halaman produk, lookbook, koleksi anniversary, dan integrasi tema premium.',
    category: 'Shopify', tags: ['Shopify', 'Liquid', 'E-Commerce'],
    image: 'assets/bassicsweb.jpeg', year: 2025, client: 'Bassics',
  },
  {
    id: '2', title: 'POBSI Sulawesi Tengah',
    description: 'Website resmi POBSI Provinsi Sulawesi Tengah. Fitur: data atlet, kejuaraan, berita, dan panel admin lengkap dengan Angular.',
    category: 'Angular', tags: ['Angular', 'Laravel', 'REST API'],
    image: 'assets/pobsiweb.png', year: 2026, client: 'DPRD Prov. Sulawesi Tengah',
  },
  {
    id: '3', title: 'Paradise Noise — WordPress',
    description: 'Website WordPress untuk brand desain kreatif dengan tampilan minimalis, blog, halaman produk, dan galeri karya.',
    category: 'WordPress', tags: ['WordPress', 'WooCommerce', 'Custom Theme'],
    image: 'assets/paradisenoiseweb.png', year: 2023, client: 'Paradise Noise',
  },
];

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly KEY = 'maulidin_projects_v2';

  getProjects(): Project[] {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) { this.save(DEFAULTS); return DEFAULTS; }
      return JSON.parse(raw) as Project[];
    } catch { return [...DEFAULTS]; }
  }

  private save(projects: Project[]): { ok: boolean; err?: string } {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(projects));
      return { ok: true };
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22 || e?.code === 1014) {
        return { ok: false, err: 'Penyimpanan penuh. Coba hapus foto project lain terlebih dahulu.' };
      }
      return { ok: false, err: 'Gagal menyimpan: ' + (e?.message ?? 'unknown error') };
    }
  }

  add(p: Project): { ok: boolean; err?: string } {
    p.id = Date.now().toString();
    const list = [p, ...this.getProjects()];
    return this.save(list);
  }

  update(p: Project): { ok: boolean; err?: string } {
    const list = this.getProjects().map(x => x.id === p.id ? p : x);
    return this.save(list);
  }

  delete(id: string): void {
    this.save(this.getProjects().filter(p => p.id !== id));
  }

  reset(): void { this.save(DEFAULTS); }
}
