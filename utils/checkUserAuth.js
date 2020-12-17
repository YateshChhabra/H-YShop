function checkUserToken(callBool){
    var bool=true;
    var i=0;
    for(let i=0;i<Object.keys(localStorage).length;i++){
        if(callBool == true){
            
            if(Object.keys(localStorage)[i].length == 9 && Object.keys(localStorage)[i][3] == "@"){
                bool=false;
                let usernameString = localStorage.getItem(Object.keys(localStorage)[i]);
                let userObj=JSON.parse(usernameString);
                
                cartOperations.userSearch(callBackForUser,userObj.username,userObj.token);
            }
        }
        else {
            
            if(Object.keys(localStorage)[i].length == 6 && typeof(parseInt(Object.keys(localStorage)[i][5])) == "number"){
                bool=false;
                
                let usernameString=localStorage.getItem(Object.keys(localStorage)[i]);
                let adminObj=JSON.parse(usernameString);
                
                adminOperations.adminSearch(callBackForadmin,adminObj.username,adminObj.token);
            }
        }
        
        if(i == Object.keys(localStorage).length-1 && bool == true){
            location.href="login.html";
        }
    }
}