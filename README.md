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
## 3) Mess (/mess)
### a) Edit Mess Menu (/menu/edit)
        Headers : token
        Body : additions,removes
        Conditions : 
                - User should be admin or super_admin
                - Body should contain atleast one of the body fields
                - Additons should strictly follow the following data structure
                        [{"meal_item":string,"meal_type":[1-9],"meal_slot":[1-4],"meal_day":[1-7]},...]
                - Removes should strictly follow the following data structure
                        [number,...]
        Response : Basic