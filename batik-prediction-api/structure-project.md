batik-api/
├── src/
│   ├── config/
│   │   ├── aws.js
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── motifController.js
│   │   ├── historyController.js
│   │   └── predictionController.js
│   ├── data/
│   │   └── dictionary.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── motifRoutes.js
│   │   ├── historyRoutes.js
│   │   └── predictionRoutes.js
│   ├── seed/
│   │   └── dictionary.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── motifService.js 
│   │   ├── historyService.js
│   │   ├── predictionServices.js
│   │   └── s3Service.js
│   ├── uploads/
│   │   └── (Gambar akan disimpan sementara lalu dipush save ke AWS S3)
│   ├── utils/
│   │   ├── helpers.js
│   │   └── constants.js 
│   └── app.js
├── sql/
│   └── schema.sql
├── .env
├── package.json
└── server.js 