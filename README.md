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
Terdapat dua fungsi penting dalam folder ini yaitu `decodeToken()` dan `police_check()`
* fungsi `decodeToken()` digunakan untuk men-decode (mengurai) token lalu memverifikasi apakah `secret key` dalam token tersebut sesuai dengan pihak yang menghasilkan token
```graphql
function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretkey);

      const user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res
          .status(500)
          .json({
            error: 500,
            message: 'Token Expired',
          });
      }
    } catch (err) {
      if (err && err.name === 'JsonWebTokenError') {
        return res
          .status(500)
          .json({
            error: 500,
            message: 'TokenMalformedError',
            info: err.message,
          });
      }

      next(err);
    }

    return next();
  };
}
```
* fungsi `police_check()` digunakan bersama dengan `express router` untuk memeriksa apakah user yang saat ini sedang login berhak untuk mengakses resource yang disediakan
```graphql
function police_check(action, subject) {
  return function (req, res, next) {
    const policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `You are not allowed to ${action} ${subject}`,
      });
    }

    next();
  };
}
```

### `/utils`
Begitu juga dalam folder ini terdapat dua fungsi penting yaitu `getToken()` dan `policyFor()`
* fungsi `getToken()` digunakan untuk mendapatkan `jwt token` dari request header yang dikirimkan oleh client
```graphql
function getToken(req) {
  const token = req.headers.authorization
    ? req.headers.authorization.replace('Bearer ', '')
    : null;

  return token && token.length ? token : null;
}
```
* fungsi `policyFor()` digunakan untuk mengatur hak akses resource yang diberikan kepada user berdasarkan role yang dia terima
```graphql
const policyFor = (user) => {
  const builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === 'function') {
    policies[user.role](user, builder);
  } else {
    policies.guest(user, builder);
  }

  return new Ability(builder.rules);
};
```
