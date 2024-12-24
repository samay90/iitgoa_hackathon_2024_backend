# Food Review System for Mess
### All the inputs should satisfy the type and length conditions (by default).

## 1) Authentication (/auth)
### a) SignIn (/signin)
        Body : email,password
        Response : token
### b) SignUp (/signup)
        Body : email,password,name
        Response : token
## 2) User (/user)
### a) Get User Data (/)
        Headers : token
        Conditions : Token should be valid and not expired
        Response : user details (user_id,email,is_admin,is_super_admin,created_at,updated_at)