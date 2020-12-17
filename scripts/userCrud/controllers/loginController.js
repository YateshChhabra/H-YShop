window.addEventListener('load',registerEvent);

function registerEvent(){
    document.getElementById('search').addEventListener('click',validateLoginForm);
}

function validateLoginForm(){
    emptySpan();
    var inputArr=document.getElementsByClassName("input");
    var spanArr=document.getElementsByClassName('blank-fields');
    
    if(inputArr[0].value == '' && inputArr[1].value == ''){
        document.getElementById('empty-error').innerText = 'Enter required fields to proceed';
    }
    else if(inputArr[0].value == '' && inputArr[1].value != ''){
        spanArr[0].innerText = 'Enter username to proceed';
    }
    else if(inputArr[0].value != '' && inputArr[1].value == ''){
        spanArr[1].innerText = 'Enter password to proceed';
    }
    else{
        let username = inputArr[0].value;
        userOperations.newSearch(callBackForUserLogin,username,true);
    }
}


function callBackForUserLogin(bool,obj){
    
    var password=document.getElementsByClassName("input")[1].value;
    if(bool==true){
        if(password == obj.password){
            let tkn= generateToken();
            obj.token=tkn;
            var userObj={"username":obj.username,"token":tkn};
            for(let key in localStorage){
                if(key.length == 9 && key[3] == "@"){
                    let username=key;
                    localStorage.removeItem(username);
                }
            }
            localStorage.setItem(obj.username,JSON.stringify(userObj));
            userOperations.add(obj);
            
            
                location.href="h&yshop.html";
            
            
        }
        else{
            document.getElementById('error').innerText ="Invalid Username or Password";
            emptyFields();
        }
    }
    else{
        let username = document.getElementsByClassName("input")[0].value;
        adminOperations.search(callBackForAdminLogin,username);
    }
}

function emptyFields(){
    let uName=document.getElementById("username");
    uName.value="";

    let passWord=document.getElementById("password");
    passWord.value="";
}

function emptySpan(){
    document.getElementById('error').innerText = '';
    document.getElementById('empty-error').innerText = '';
    var spanArr = document.getElementsByClassName('blank-fields');
    for(let i=0;i<spanArr.length;i++){
        spanArr[i].innerText="";
    }
}