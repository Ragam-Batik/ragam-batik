batik-api/
├── src/
│ ├── config/
│ │ └── supabase.js # Supabase configuration
│ ├── controllers/
│ │ ├── authController.js # Auth-related controllers
│ │ ├── batiksController.js # Batik prediction and info controllers
│ │ └── catalogController.js # Catalog-related controllers
│ ├── models/
│ │ └── dictionary.js # Batik dictionary data
│ ├── plugins/
│ │ ├── auth.js # Auth plugin
│ │ └── tensorflow.js # TensorFlow plugin
│ ├── routes/
│ │ ├── authRoutes.js # Auth-related routes
│ │ ├── batiksRoutes.js # Batik-related routes
│ │ └── catalogRoutes.js # Catalog-related routes
│ ├── services/
│ │ ├── predictionService.js # ML prediction service
│ │ └── storageService.js # File storage service
│ ├── utils/
│ │ ├── fileUtils.js # File handling utilities
│ │ └── imageUtils.js # Image processing utilities
│ └── server.js # Main server file
├── model/
│ └── model_testing_1.keras # The trained ML model
├── .env # Environment variables
├── package.json # Project dependencies
└── README.md # Project documentation
