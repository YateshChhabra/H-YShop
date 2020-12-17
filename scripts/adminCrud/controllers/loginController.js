

function callBackForAdminLogin(bool,obj){
    if(bool==true){
        var password=document.getElementsByClassName("input")[1].value;
        if(password == obj.password){
            let tkn= generateToken();
            obj.token=tkn;
            var userObj={"username":obj.username,"token":tkn};
            for(let key in localStorage){
                if(key.length == 6 && typeof(parseInt(key[key.length-1])) == "number"){
                    let username=key;
                    localStorage.removeItem(username);
                }
            }
            localStorage.setItem(obj.username,JSON.stringify(userObj));
            adminOperations.add(obj);
            
                location.href="admindashboard.html";
            
        }
        else{
            document.getElementById('error').innerText ="Invalid Username or Password";
            emptyFields();
        }
    }
    else{
        document.getElementById('error').innerText ="Invalid Username or Password";
        emptyFields();
    }
}
