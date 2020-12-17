const cartOperations={
    add(...argv){
        if(argv.length == 1){
            let custName=argv[0].cust_name;
            var pr=firebase.database().ref("/carts/"+custName).set(argv[0]);
            
        }
        //0:Category    1:Id    2:Product Obj   3:CustName
        else{
            
            var pr=firebase.database().ref("/carts/"+argv[3]+"/"+argv[0]+"/"+argv[1]).set(argv[2]);
        }
        pr.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },

    deleteCartProduct(cust_name,category,productId){
        var pr=firebase.database().ref("/carts/"+cust_name+"/"+category+"/"+productId).remove();
        pr.then(()=>console.log("Data Deleted Successfully")).catch(error=>console.log("Error is: ",error));

    },

    searchCart(callBack,custName,productCategory,productID,bool){
        
        if(bool==true){
            var pr=firebase.database().ref("/carts/"+custName);
        }

        else{
            var pr=firebase.database().ref("/carts/" + custName + "/" + productCategory + "/" + productID);
        }
       
                pr.once('value',(snapshot)=>{
                    var cartObj=snapshot.val();
                    if(cartObj == null){
                        callBack(false,undefined,productCategory,productID);
                    }
                    else{
                        callBack(true,cartObj,productCategory,productID);  
                    }
                })
    },

    searchProduct(...argv){
        //0:Callback,   1:Product ID,   2:Category,     3:Quantity     4:Value oF I for Product Cart
      
            let path="/products/"+argv[2]+"/"+argv[1];
            var pr=firebase.database().ref(path);
                pr.once('value',(snapshot)=>{
                    var prodObj=snapshot.val();
                    if(prodObj==null){
                        argv[0](false,undefined,undefined,undefined,undefined);
                    }
                    else{
                        argv[0](true,prodObj,argv[3],argv[2],argv[4]);  
                    }
                })
    },

    search(...argv){
        //0:Callback,   1:Product ID,   2:Category,     3:Value oF I is for Printing 9 Products
        if(argv.length==4){
            let path="/products/"+argv[2]+"/"+argv[1];
            var pr=firebase.database().ref(path);
                pr.once('value',(snapshot)=>{
                    var prodObj=snapshot.val();
                    if(prodObj==null){
                        argv[0](false,undefined,undefined,undefined);
                    }
                    else{
                        argv[0](true,prodObj,argv[3],argv[2]);  
                    }
                })
        }
        //0:Callback,   1:Category, 2:Arr
        else{
            let path="/products/"+argv[1];
            var pr=firebase.database().ref(path);
                pr.once('value',(snapshot)=>{
                    var prodObj=snapshot.val();
                    if(prodObj==null){
                        argv[0](false,undefined,undefined,undefined);
                    }
                    else{
                        argv[0](true,prodObj,argv[1],argv[2]);
                    }
                })
        }
    },

    userSearch(callBack,username,localToken){
        var pr=firebase.database().ref("/users/"+username);
        pr.once('value',(snapshot)=>{
            var obj=snapshot.val();
            if(obj==null){
                callBack(false,undefined,undefined)
            }
            else{
                callBack(true,localToken,obj);
            }
        })
    },

    loadOffer(callBack){
        var promise = firebase.database().ref("/offers");

        promise.once("value",(snapshot)=>{
            var offerObject = snapshot.val();

            if(offerObject == null){
                callBack(false,undefined);
            }
            else{
                callBack(true,offerObject);
            }
        });
    },
    addOrderProducts(orderId,cartObject){
        var promise = firebase.database().ref("/cartRef/" + orderId).set(cartObject);
    },
    delete(customerName){
        var promise = firebase.database().ref("/carts/" + customerName).set({});

        promise.then(data=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    }

   
}