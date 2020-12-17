const adminOperations = {
    add(admin){
        var uname = admin.username;
        var pr = firebase.database().ref("/admins/"+uname).set(admin);
        pr.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    search(callBack,admin){
        var pr=firebase.database().ref("/admins/"+admin);
        pr.once('value',(snapshot)=>{
            var obj = snapshot.val();
            
            if(obj == null){
                callBack(false,undefined);
            }
            else{
                callBack(true,obj);
            }
        })
    },
    adminSearch(callBack,adminName,localToken){
        var pr=firebase.database().ref("/admins/"+adminName);
        pr.once('value',(snapshot)=>{
            var obj=snapshot.val();
            if(obj==null){
                callBack(false,undefined,undefined)
            }
            else{
                callBack(true,localToken,obj);
            }
        })
    }
}