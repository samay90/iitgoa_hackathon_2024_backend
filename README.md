# Food Review System for Mess
All the inputs should satisfy the type and length conditions (by default).

## 1) Authentication (/auth)
### a) SignIn (/signin) (POST)
        Body : email,password
        Response : token
### b) SignUp (/signup) (POST)
        Body : email,password,name
        Response : token
## 2) User (/user)
### a) Get User Data (/) (GET)
        Headers : token
        Conditions : Token should be valid and not expired
        Response : user details (user_id,email,is_admin,is_super_admin,created_at,updated_at)
## 3) Mess (/mess)
### a) Edit Mess Menu (/menu/edit) (POST)
        Headers : token
        Body : additions,removes
        Conditions : 
                - User should be admin or super_admin
                - Body should contain atleast one of the body fields
                - Additons should strictly follow the following data structure
                        [{meal_item:string,meal_type:[1-9],meal_slot:[1-4],meal_day:[1-7]},...]
                - Removes should strictly follow the following data structure
                        [number,...]
        Response : Basic
### b) Get Current Menu (/menu/current) (GET)
        Headers : token
        Response Logic : It gives the menu of the next comming meal based on current time
        Response : {menu_day:number,menu_slot:number,menu:[{meal_item:string,meal_type:number,meal_id:number},...]}
### c) Add or Edit Feedback (/feedback) (POST)
        Headers : token
        Body : feedback,meal_slot,meal_date
        Conditions :
                - Feedback should strictly follow the following data structure 
                        [{menu_id:number,rating:number[1-5],qna:[{question:string,answer:string},...]},...]
                - meal_date should be in the valid Javascript format 
                - Current date should match with the meal_date
                - meal should have been completed (current_time>timing's of the meal_slot)
                - menu_id's should match with meal's in that particular meal_slot
                - the previously submitted will be deleted by default (For Edit)  