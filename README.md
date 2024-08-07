## CARA INSTALL
### COHERE API
Versi talent API menampilkan input *Custom Promp*. Jika pilihan ini aktif, program akan menampilkan
input custom prompt yang nantinya akan terhubung ke API dari https://cohere.com.
Saat ini KEY_ACCESS menggunakan versi trial. 

Jika pilihan ini di uncheck, API hanya terhubung ke lokal database saja

### MEMBUAT LOCAL DB
1. Buka folder *generate-data*
```
cd generate-data
```
2. create docker weaviate. Tambahkan -d jika ingin berjalan di background
```
docker compose up
```
3. buat conda environment
```
conda create -n data-finder python=3.10
```
4. activate conda
```
conda activate data-finder
```
5. install requirement library
```
pip install -r requirements.txt
```
6. informasi code
```
a. book_create_db.py : Code untuk membuat book data finder
b. talent_create_db.py : Code untuk membuat talent data finder (old version)
c. talent_create_db_v2.py : Code untuk membuat talent data finder
d. talent_create_db_v3.py : Code untuk membuat talent data finder (latest version)
```
7. Jalankan script untuk membuat lokal db. Misal: *talent_create_db_v3.py*. Sesuaikan parameter *ollama_api* jika ditemukan error saat di run.
```
python talent_create_db_v3.py
```
8. Masuk ke folder root (local-data-finder). Install node environment
```
npm install
```
9. Jalankan frontend dengan perintah :
```
npm run serve
```
10. Edit *.env* file jika diperlukan
11. Buka browser buka url dari proses sebelumnya. Pastikan frontend terhubung dengan lokal db


### CATATAN KODE FRONTEND
Kode frontend terletak di folder *pages*
1. database Book
```
frontend : index-book.tsx
api : api/recommendatios_book.ts
```
2. database talent
```
frontend : index-talent.tsx
api : api/recommendatios_talent.ts
```
3. database talent_v2
```
frontend : index.tsx
api : api/recommendatios_talent_v2.ts
```
4. database talent_v3 (Latest)
```
frontend : index.tsx
api : api/recommendatios_talent_v3.ts
```