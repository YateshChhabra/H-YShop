const productOperations = {
    add(product,arr){
        var pid=product.product_id;
        var category=arr[6].value;
        var pr = firebase.database().ref("/products/"+category+"/"+pid).set(product);
        pr.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    search(callBack,id,category,bool){
        var promise = firebase.database().ref("/products/"+category+"/"+id);
        promise.once('value',(snapshot)=>{
            var productObject = snapshot.val();
                if(productObject == null){
                    if(bool==true){
                        callBack(false,undefined,undefined);           //Product not there!! Search Call from NavBar
                    }           
                    else{
                        callBack(false);                    //Product to add!!
                    }
                }
            else{
                if(bool==true){
                    callBack(true,productObject,category);            //Product Already Exists Search Call from NavBar
                }
                else{
                    callBack(true);                         //Product Already Exists
                }
            }
        });
    },
    show(callback,category){
        var pr=firebase.database().ref("/products/"+category);
        pr.once('value',(snapshot)=>{
            var obj=snapshot.val();
            if(obj==null){
                callback(false,undefined,undefined);
            }
            else{ 
                callback(true,category,obj);
            }
        })
    },
    delete(id,category){
        var promise = firebase.database().ref("/products/"+category+"/"+id).remove();
        promise.then(()=>console.log("Data Deleted Successfully")).catch(error=>console.log("Error is: ",error));
    },

    load(callBack){
        var promise = firebase.database().ref("/categories");
        promise.once("value",(snapshot)=>{
            var obj=snapshot.val();
            if(obj==null){
                callBack(false,undefined);
            }
            else{
                callBack(true,obj);
            }
        });
    }
}
