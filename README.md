## Deskripsi
Ini merupakan mini project backend yang nantinya digunakan untuk membuat perusahaan PT. Bahawan Integrasi Nusantara menjadi lebih berkembang dan lebih baik lagi. Untuk mencapai tujuan tersebut tentu perlu adanya kerjasama baik secara internal khususnya team teknikal dan eksternal yang mana sudah pasti adalah mereka yang menggunakan layanan perusahaan tersebut. Tidak hanya itu, agar tujuan tersebut tercapai perlu adanya komunikasi antara team teknikal dan users selaku pengguna yang merasakan bagaimana pengalaman mereka ketika menggunakan layanan tersebut. Namun komunikasi antara team teknikal dan users tidak akan terlaksana kecuali dengan adanya suatu perantara, yaitu aplikasi backend ini.

## Teknologi
Adapun beberapa teknologi utama yang digunakan dalam mengembangkan project ini:
* JavaScript
* NPM
* NodeJs
* ExpressJs
* MongoDB
* Mongoose

## Fitur
Beberapa fitur yang di terapkan:
* Search
* Filter berdasarkan nomor kategori, prioritas & status
* Pagination
* Logger menggunakan Morgan Library
* Otentikasi menggunakan JWT
* Otorisasi berdasarkan role menggunakan Casl Library
* Validasi Payload
* Validasi Token
* Linter menggunakan Eslint dengan style Airbnb
* Test dengan Mocha & Chai Library
* Test menggunakan Postman

## Struktur Folder
Terdapat beberapa folder inti dalam project ini:
* `/app`
* `/constant`
* `/database`
* `/middlewares`
* `/utils`

### `/app`
Folder inti dalam project ini adalah `/app`. Folder ini berisi semua program yang dapat dieksekusi atau dalam hal ini layanan sistem tiket.
* `/app/config` berisikan satu file untuk mengatur `environment variable` yang berhubungan dengan `jwt secret key` dan `database`
```graphql
dotenv.config();
module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  mongoUrl: process.env.MONGO_URL,
  mongoUrlTest: process.env.MONGO_URL_TEST,
  secretkey: process.env.SECRET_KEY,
};
```
* `/app/user/model.js` berisikan skema database menggunakan skema mongoose untuk entitas user
* `/app/auth` berisikan rute dan handler yang berhubungan dengan otentikasi
* `/app/category` berisikan model, rute dan handler yang berhubungan akses tulis baca categori
* `/app/ticket` berisikan model, rute dan handler yang berhubungan akses tulis baca tiket

### `/constant`
Terdapat satu file yang digunakan untuk menentukan status tiket yang akan keluar berdasarkan `query param status` yang terdapat pada url
* `/constant/index.js`
```graphql
const ticketStatus = {
  1: 'menunggu tindakan',
  2: 'sedang dalam proses',
  3: 'sedang direspon',
  4: 'telah selesai',
};
```

### `/database`
Konfigurasi database di letakkan dalam file yang terdapat dalam folder ini
* `/database/index.js`
```graphql
mongoose.connect(mongoUrl);
const db = mongoose.connection;
```

### `/middlewares`
Terdapat dua fungsi penting yaitu ```graphql decodeToken()``` dan ```graphql police_check()```
