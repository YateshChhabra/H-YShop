const orderOperations={
    newSearch(...argv){
        if(argv.length==4){
            var pr=firebase.database().ref("/products/"+argv[1]+"/"+argv[2]);
            pr.once('value',(snapshot)=>{
            var obj=snapshot.val();
                if(obj==null){
                    argv[0](false,undefined,undefined,undefined)
                }
                else{
                    argv[0](true,obj,argv[1],argv[3]);
                }
            });
        }
        else if(argv.length==3){
            var promise = firebase.database().ref("/offers/"+argv[1]);
            promise.once("value",(snapshot)=>{
            var offerObject = snapshot.val();
                if(offerObject == null){
                    argv[0](false,undefined,argv[2]);
                }
                else{
                    argv[0](true,offerObject,argv[2]);
                }
            });
        }
        else{
            var pr=firebase.database().ref(argv[1]);
            pr.once('value',(snapshot)=>{
                var obj=snapshot.val();
                if (obj==null){
                    argv[0](false,undefined);
                }
                else{
                    argv[0](true,obj);
                }
            });
        }        
    },
    add(obj){
       // console.log(obj);
        var o_id=obj.order_id;
        var pr=firebase.database().ref("/orders/"+o_id).set(obj);
        pr.then((data)=>{console.log("Data is added in the databse")}).catch((err)=>{console.log("Error is",err )});
    }
};