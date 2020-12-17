const userOperations = {
    add(user){
        var uname = user.username;
        var pr = firebase.database().ref("/users/"+uname).set(user);
        pr.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },

    newSearch(callBack,username,bool){
        
        var pr=firebase.database().ref("/users/"+username);
        pr.once('value',(snapshot)=>{
            var obj = snapshot.val();

            if(obj == null){
                if(bool==true){
                    callBack(false,undefined);     //for failed login 
                }
                else{
                    callBack(false);               //for successfull signup
                }
            }
            else{
                if(bool==true){
                    callBack(true,obj);            //for successfull login and Forget Password
                }
                else{
                    callBack(true);                //for failed signup
                }
            }
        })
    },
}