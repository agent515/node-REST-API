"# node-REST-API" 

The API is for the shopping store. The API is built with nodeJS to provide the RESTful (statless) services.
Express is used as the framework for the app while MongoDB Atlas helps with the DB (Cloud).

The dependencies are:

"dependencies": {
    "bcrypt": "^4.0.1",
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.9.5",
    "morgan": "^1.9.1",
    "multer": "^1.4.2"
  }
  
Following services are available using this API:
  Product:
      1. Create product (POST)
      2. See a product (GET)
      3. See all the products (GET)
      4. Update the product (PATCH)
      5. Delete the product (DELETE)
  Order: 
      1. Place an order (POST)
      2. See an order (GET)
      3. See all the orders (GET)
      4. Delete the order (DELETE)
  User: 
      1. Sign up (POST)
      2. Log in (POST)
      3. Delete user (DELETE)
      
