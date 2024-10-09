# E-commerce

## Introduction
The E-commerce Platform is a web application designed to provide a seamless online shopping experience for users. Built using modern web technologies, the platform allows users to browse a wide range of products, manage their shopping carts, and securely complete purchases. It supports features such as product reviews, search functionality, and personalized recommendations to enhance the shopping experience.

On the backend, the platform is powered by Node.js and Express.js for managing API requests and business logic, while MongoDB is used to store product, user, and order data. The system incorporates role-based access control, with two main roles: Admin and User.

Key Features:
User Registration & Authentication: Secure signup and login functionality with JWT-based authentication.
Product Catalog: Users can view detailed information about various products categorized into multiple categories and subcategories.
Shopping Cart & Wish List: Users can add products to their shopping carts or wish lists for future purchases.
Order Management: Users can place orders and track their purchase history, while admins can manage all orders.
Admin Dashboard: Admins can add, update, and delete products and categories, and manage user accounts.

## Prerequisites
Before running the project, you need to have the following installed:
- Node.js
- MongoDB

## Installation
To install and run the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone(https://github.com/zead282/ecommerce-v11)

  ## Install dependencies:
    npm install

## start
  npm start


## Project Structure
 /src contains  #utils and controllers and routes and all middlewares
 /controllers   # Contains business logic
/routes        # Define the application's routes
/models        # Define the database schemas and models


## .env file
  # contain all data that i want to keep it encrypt like port,cloudinary connection................


### API Endpoints
 ## POST /auth/login: Authenticates a user and returns a token.
    # {
  "email":"email",
  "password": "password"
}

## POST /auth/signup: verfiy email and send verfication code
    # {
   username,
        email,
        password,
        age,
        role,
        phoneNumbers,
        addresses,
}

## DELETE /user/deleteaccount: Authenticates a user and delete the user account
    # {
     token
}

## UPDATE /user/updateaccount: Authenticates a user and update the user account

## put /user/updateaccount: Authenticates a user and update the user account

## post /user/forgetpassword: Authenticates a user and send otp code to user email to go to resetpassword api

##  post /user/reset: Authenticates a user and put new passowrd by useing otp and newpassword



#### product
  ## post /product/add: authenticates a admin and add new product related to category with using cloudinary to upload images
   #{
        const{title,baseprice,desc,stock,discount,specs}=req.body;
       const{subCategoryId,categoryId,brandId}=req.query
       const{_id}=req.authUser;}

  ## put /product/update: authenticates a admin and update product
    #{
         const{_id}=req.authUser;
        const{productid}=req.params;
         const{title,oldpublicid,stock,baseprice,desc,specs,discount}=req.body;}

  ## delete /product/delete:authenticates a admin and update product
    #{
        const{productid}=req.params
    }

   ## get /product/get : return all products for all users without need to login or token


#### category
   ## post /category/add: authenticates a admin and add new category
    #const{name}=req.body;
    const{_id}=req.authUser;

   ## put /category/update: authenticates a admin and update category 

   ## delete /category/delete: authenticates a admin and delete category and delete related prand and related subcategory

## all crud for order and subcategory and brand   


## payments 
 # integrate with stripe
