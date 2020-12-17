window.addEventListener('load',registerEvent);

function registerEvent(){
    document.getElementById('change').addEventListener('click',changePassword);
}

function changePassword(){
    emptySpan();
    var inputArr = document.getElementsByClassName('input-field');
    var spanArr =document.getElementsByClassName('blank-fields');
    if(inputArr[0].value == '' && inputArr[1].value != '' && inputArr[2].value != '' && inputArr[3].value != ''){
        spanArr[0].innerText = 'Enter username to proceed';
    }
    else if(inputArr[0].value != '' && inputArr[1].value == '' && inputArr[2].value != '' && inputArr[3].value != ''){
        spanArr[1].innerText = 'Enter Last 4 digit of Mobile to proceed';
    }
    else if(inputArr[0].value != '' && inputArr[1].value != '' && inputArr[2].value == ''  && inputArr[3].value != ''){
        spanArr[2].innerText = 'Enter new password to proceed';
    }
    else if(inputArr[0].value != '' && inputArr[1].value != '' && inputArr[2].value != ''  && inputArr[3].value == ''){
        spanArr[2].innerText = 'Enter password to proceed';
    }
    else if(inputArr[0].value != '' && inputArr[1].value != '' && inputArr[2].value != '' && inputArr[3].value != ''){
        if(inputArr[2].value == inputArr[3].value){
            let username=inputArr[0].value;
            userOperations.newSearch(callBackForUser,username,true);
        }
        else{
            let message = 'Password does not matched';
            document.getElementById('error').innerText = message;
        }
    }
    else{
        document.getElementById('empty-error').innerText = 'Enter required fields to proceed';
    }
}

function callBackForUser(bool,userObject){
    
    if(bool == true){
        var inputArr = document.getElementsByClassName('input-field');
        var lastFour = userObject.phoneNumber.substr(userObject.phoneNumber.length - 4);
       
        if(lastFour == inputArr[1].value){
            userObject.password = inputArr[2].value;
            userOperations.add(userObject);
            alert("Password changed successfully");
            emptyInputFields();
        }
    }
    else{
        document.getElementById("error").innerText = "Invalid username";
        emptyInputFields();
    }
}

function emptyInputFields(){
    var inputArr=document.getElementsByClassName('input-field');
    for(let i=0;i<inputArr.length;i++){
        inputArr[i].value = "";
    }
}

function emptySpan(){
    document.getElementById('error').innerText = '';
    document.getElementById('empty-error').innerText = '';

    var spanArr = document.getElementsByClassName('blank-fields');
    for (let i=0;i<spanArr.length;i++){
        spanArr[i].innerText = '';
    }
}