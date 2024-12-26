# Food Review System for Mess
### Access Database files here : <a href="https://drive.google.com/drive/folders/1GEeO9Fp8JepQYJYBITMxHt7NnGt9qwR9?usp=sharing">Database</a>
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
        Response : Basic
### b) Change user role (/:user_id/role/change) (POST)
        Headers : token
        Params : user_id
        Body : user_role [1->Normal,2->Admin]
        Conditions : 
                - User should be super_admin.
                - User to update should not be super admin.
        Response : Basic
### c) Get or Find Users (/find/:page?q=search)
        Headers : token
        Params : page
        Query : q
        Conditions :
                - User should be admin or super_admin.
                - page should be number
                - q is the search parameter (if not given than it will give all the users)
                - q will be search in users name and email.
        Response : total_results,total_in_page,page_no,total_pages,results <- Data of users
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
        Body : feedback,meal_slot
        Conditions :
                - Feedback should strictly follow the following data structure 
                        [{menu_id:number,rating:number[1-5],qna:[{question:string,answer:string},...]},...]
                - Current date will be considered as meal_date by default 
                - meal should have been completed (current_time>timing's of the meal_slot)
                - menu_id's should match with meal's in that particular meal_slot
                - the previously submitted feedback will be deleted by default (For Edit)
                - Editing of the feedback is only allowed on the day of the meal  
        Response : Response with total feedback's count
### d) Add Suggestion (/suggestion) (POST)
        Headers : token
        Body : changes_old_item,changes_new_item (Required),reason
        Conditions : 
                - changes_old_item should be menu_id.
                - if changes_old_item is empty that changes_new_item will be considered as addition of item.
                - changes_new_item should the name of the item.
        Response : Response with total suggestion's count
### e) Mark Attendance or Edit (/attend) (POST)
        Headers : token
        Body : is_attending [0-1]
        Conditions :
                - attendance will be taken for the next coming meal slot.
                - It will be taken till the meal time is over and after that attendance for the next meal will start.
                - If a attendance already exist than it will be updated
        Response : meal_date,meal_slot
### f) Announce (/announcement/new) (POST)
        Headers : token
        Body : announcemnt_title,announcemnt_message
        Conditions : 
                - user should be admin or super_admin
                - Both the fields are required
        Response : Basic
### g) Edit Announcemnt (/announcement/edit) (POST)
        Headers : token
        Body : announcement_title,announcement_message,announcement_id
        Conditions : 
                - user should be admin or super_admin
                - Anyone of the announcement_title or announcement_announcement is required
                - announcemnt should belong to the particular user
        Response: Basic
### h) Delete Announcement (/announcement/delete) (POST)
        Headers : token
        Body : announcement_id
        Conditions :
                - user should be admin or super_admin
                - announcemnt should belong to the particular user
        Response : Basic
### i) Get full menu (/menu/full) (GET)
        Headers : token
        Response [{meal_day:number[1-7],meal_slot:number[1-4],menu:[{menu_id:number,menu_type:string,menu_type:number[1-9]},...]},...]
### j) Add or Update Waste (/wastage/set) (POST)
        Headers : token
        Body : wastage(kg),meal_date,meal_slot
        Conditions : 
                - user should be admin or super_admin
                - meal should have been completed
                - if data of wastage already exist than it will be updated
### k) Get wastages (/wastages/:page) (POST)
        Headers : token
        Params : page
        Body : start_date,end_date
        Conditions : 
                - start_date and end_date should be in valid JS format
                - page should be number
        Response : total_results,total_in_page,page_no,total_pages,results <- Data of wastages between start_date and end_date
### l) Get announcements (/announcements/:page) (GET)
        Headers : token
        Params : page
        Conditions :
                - page should be number
        Response : total_results,total_in_page,page_no,total_pages,results <- Data of announcemnts
### m) Get Next Meal Attendance (/attendance/next) (GET)
        Headers : token
        Conditions : 
                - user should be admin or super_admin
        Response : total_attendance,meal_date,meal_slot
### n) Get Feedbacks (/feedbacks/:page) (POST)
        Headers : token
        Body : meal_date
        Conditons : 
                - user should be admin or super_admin
                - meal_date should be valid JS date
        Response : total_result,total_in_page,page_no,total_pages,results <- Data of feedbacks
### o) Get Suggestions (/suggestions/:page) (GET)
        Headers : token
        Conditons : 
                - user should be admin or super_admin
        Response : total_result,total_in_page,page_no,total_pages,results <- Data of suggestions