import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProjectService, Project } from '../../../services/project.service';
import { ImageCompressService } from '../../../services/image-compress.service';

type Tab = 'projects' | 'stats';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  projects: Project[] = [];
  tab: Tab = 'projects';

  // Modal
  modal = false;
  editMode = false;
  saving = false;
  errMsg = '';
  okMsg  = '';
  deleteId: string | null = null;

  // Image
  preview  = '';
  imgInfo  = '';
  dragging = false;

  // Tags
  tagInput = '';

  form: Project = this.blank();

  constructor(
    private auth: AuthService,
    private svc: ProjectService,
    private img: ImageCompressService,
  ) {}

  ngOnInit() { this.load(); }
  load() { this.projects = this.svc.getProjects(); }

  blank(): Project {
    return { id:'', title:'', description:'', category:'', tags:[], image:'', year: new Date().getFullYear(), client:'', link:'' };
  }

  openAdd() {
    this.form = this.blank();
    this.preview = ''; this.imgInfo = '';
    this.errMsg = ''; this.okMsg = '';
    this.editMode = false; this.modal = true;
  }

  openEdit(p: Project) {
    this.form = { ...p, tags: [...p.tags] };
    this.preview = p.image ?? '';
    this.imgInfo = p.image ? `${this.img.getSizeKB(p.image)} KB (tersimpan)` : '';
    this.errMsg = ''; this.okMsg = '';
    this.editMode = true; this.modal = true;
  }

  closeModal() {
    this.modal = false;
    this.saving = false;
    this.preview = ''; this.imgInfo = '';
    this.errMsg = ''; this.okMsg = '';
    this.dragging = false;
  }

  // ── SAVE ────────────────────────────────────────────────────
  async save() {
    this.errMsg = ''; this.okMsg = '';
    if (!this.form.title.trim() || !this.form.description.trim() || !this.form.category.trim()) {
      this.errMsg = 'Judul, Kategori, dan Deskripsi wajib diisi.'; return;
    }

    this.saving = true;
    try {
      // Kompres gambar kalau ada dan belum tersimpan (bukan data lama)
      let finalImg = this.preview;
      if (finalImg && finalImg.startsWith('data:image') &&
          !finalImg.startsWith('data:image/jpeg')) {
        finalImg = await this.img.compress(finalImg);
      } else if (finalImg && this.img.getSizeKB(finalImg) > 300) {
        finalImg = await this.img.compress(finalImg);
      }
      this.form.image = finalImg;

      const res = this.editMode ? this.svc.update(this.form) : this.svc.add(this.form);

      if (res.ok) {
        this.okMsg = this.editMode ? '✓ Project berhasil diupdate!' : '✓ Project berhasil ditambahkan!';
        this.load();
        setTimeout(() => this.closeModal(), 1000);
      } else {
        this.errMsg = res.err ?? 'Gagal menyimpan.';
      }
    } catch (e: any) {
      this.errMsg = 'Error: ' + (e?.message ?? 'Terjadi kesalahan.');
    } finally {
      this.saving = false;
    }
  }

  // ── DELETE ───────────────────────────────────────────────────
  askDelete(id: string) { this.deleteId = id; }
  cancelDelete()        { this.deleteId = null; }
  doDelete(id: string)  { this.svc.delete(id); this.deleteId = null; this.load(); }

  // ── IMAGE ────────────────────────────────────────────────────
  pickFile() { this.fileInputRef.nativeElement.click(); }

  onFileChange(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.readFile(f);
  }

  onDragOver(e: DragEvent)  { e.preventDefault(); this.dragging = true; }
  onDragLeave()              { this.dragging = false; }
  onDrop(e: DragEvent) {
    e.preventDefault(); this.dragging = false;
    const f = e.dataTransfer?.files?.[0];
    if (f?.type.startsWith('image/')) this.readFile(f);
  }

  readFile(f: File) {
    const r = new FileReader();
    r.onload = ev => {
      const b64 = ev.target!.result as string;
      this.preview = b64;
      const kb = this.img.getSizeKB(b64);
      this.imgInfo = kb > 300
        ? `${kb} KB — akan dikompres otomatis`
        : `${kb} KB ✓`;
    };
    r.readAsDataURL(f);
  }

  removeImg() {
    this.preview = ''; this.imgInfo = '';
    this.fileInputRef.nativeElement.value = '';
  }

  // ── TAGS ─────────────────────────────────────────────────────
  addTag() {
    const t = this.tagInput.trim();
    if (t && !this.form.tags.includes(t)) this.form.tags = [...this.form.tags, t];
    this.tagInput = '';
  }
  removeTag(t: string) { this.form.tags = this.form.tags.filter(x => x !== t); }
  tagKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); this.addTag(); }
  }

  logout() { this.auth.logout(); }

  // ── COMPUTED ─────────────────────────────────────────────────
  get total()      { return this.projects.length; }
  get withImg()    { return this.projects.filter(p => p.image).length; }
  get cats()       { return [...new Set(this.projects.map(p => p.category))]; }
  catCount(c: string) { return this.projects.filter(p => p.category === c).length; }
  get valid()      { return !!(this.form.title?.trim() && this.form.description?.trim() && this.form.category?.trim()); }
}
