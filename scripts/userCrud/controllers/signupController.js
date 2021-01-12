window.addEventListener('load',registerEvent);

function registerEvent(){
    document.getElementById('add').addEventListener('click',validateSignUpForm);
}

function validateSignUpForm(){
    emptySpan();
    var input_array = document.getElementsByClassName('input-field');
    var span_array= document.getElementsByClassName('blank-fields');

    if(input_array[0].value == '' && input_array[1].value != '' && input_array[2].value != '' && input_array[3].value != '' && input_array[4].value != '' && input_array[5].value != ''){
        span_array[0].innerText = 'Enter username to proceed';
    }
    else if(input_array[0].value != '' && input_array[1].value == '' && input_array[2].value != '' && input_array[3].value != '' && input_array[4].value != '' && input_array[5].value != ''){
        span_array[1].innerText = 'Enter Phone Number to proceed';
    }
    else if(input_array[0].value != '' && input_array[1].value != '' && input_array[2].value == '' && input_array[3].value != '' && input_array[4].value != '' && input_array[5].value != ''){
        span_array[2].innerText = 'Enter Address to proceed';
    }
    else if(input_array[0].value != '' && input_array[1].value != '' && input_array[2].value != '' && input_array[3].value == '' && input_array[4].value != '' && input_array[5].value != ''){
        span_array[3].innerText = 'Enter email to proceed';
    }
    else if(input_array[0].value != '' && input_array[1].value != '' && input_array[2].value != '' && input_array[3].value != '' && input_array[4].value == '' && input_array[5].value != ''){
        span_array[4].innerText = 'Enter password to proceed';
    }
    else if(input_array[0].value != '' && input_array[1].value != '' && input_array[2].value != '' && input_array[3].value != '' && input_array[4].value != '' && input_array[5].value == ''){
        span_array[5].innerText = 'Enter password to proceed';
    }
    else if(input_array[0].value != '' && input_array[1].value != '' && input_array[2].value != '' && input_array[3].value != '' && input_array[4].value != '' && input_array[5].value != ''){
        
        if(input_array[4].value == input_array[5].value){
            let resultArr = checkRegex(input_array);
            if(resultArr[0]==true && resultArr[1]==true && resultArr[2]==true && resultArr[3]==true){
                let username=input_array[0].value;
                userOperations.newSearch(callBackForUserSignup,username,false);
            }
            for(let i=0;i<resultArr.length;i++){
                if(resultArr[i]==false){
                    if(i==0){
                        span_array[i].innerText="Username should be of length 9, 4th letter should be @ \n Eg : abc@abcd";
                    }
                    else if(i==1){
                        span_array[i].innerText="Eg: +91-0123456789";
                    }
                    else if(i==2){
                        span_array[i].innerText="Eg: example example,State-123456";
                    }
                    else if(i==3){
                        span_array[i].innerText="Eg: example@gmail.com";
                    }
                }
            }
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

function callBackForUserSignup(bool){
    if(bool==true){
        document.getElementById('empty-error').innerText ="User Name Already Taken";
        emptyFields();    
    }
    else{
        addUser();
    }
}

function addUser(){
    var user = new User();                                  //{username:"",email:"",password:""}
    for(let key in user){
        user[key] = document.getElementById(key).value;     //user[username] = document.getElementById(username).value;
    }
    userOperations.add(user);
    alert('Account Created Successfully');
    emptyFields();
}

function emptyFields(){
    var input_array = document.getElementsByClassName('input-field');
    for (let i=0;i<input_array.length;i++){
        input_array[i].value = '';
    }
}

function emptySpan(){
    document.getElementById('error').innerText = '';
    document.getElementById('empty-error').innerText = '';
    var spanArr = document.getElementsByClassName('blank-fields');
    for(let i=0;i<spanArr.length;i++){
        spanArr[i].innerText="";
    }
}
