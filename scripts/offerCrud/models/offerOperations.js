const offerOperations = {
    add(offer){
        var o_code=offer.offer_code;
        var pr = firebase.database().ref("/offers/"+o_code).set(offer);
        pr.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    search(callBack,code,bool){
            var promise = firebase.database().ref("/offers/"+code);
            promise.once('value',(snapshot)=>{
               var offerObject = snapshot.val();
                  if(offerObject == null){
                        if(bool==true){
                            callBack(false,undefined);           //offer not there!! Search Call from NavBar
                        }           
                        else{
                            callBack(false);                    //offer to add!!
                        }
                    }
                else{
                    if(bool==true){
                        callBack(true,offerObject);            //offer Already Exists Search Call from NavBar
                    }
                    else{
                        callBack(true);                         //offer Already Exists
                    }
                }
            });
    },
    show(callback){
            var pr=firebase.database().ref("/offers/");
            pr.once('value',(snapshot)=>{
                var obj=snapshot.val();
                if(obj==null){
                    callback(false,undefined);
                }
                else{ 
                    callback(true,obj);
                }
            })
    },
    delete(code){
        var promise = firebase.database().ref("/offers/"+code).remove();
        promise.then(()=>console.log("Data Deleted Successfully")).catch(error=>console.log("Error is: ",error));
    },
};
