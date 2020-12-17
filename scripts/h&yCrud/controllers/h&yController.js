window.addEventListener('load',registerEvents);

function registerEvents(){
    if(document.getElementById("signOut")){
        checkUserToken(true);
        document.getElementById("signOut").addEventListener('click',signout);
    }
    

    var buttons = document.getElementsByClassName("button-view");
    for(let button of buttons){
        button.addEventListener("click",viewProduct);
    }
   
    var cart=document.getElementsByClassName("button-cart");
    for(let addProduct of cart){
        addProduct.addEventListener("click",addToCart);
    }

    loadCategories();
    loadOffers();
    if(document.getElementById("searchProductDetails")){
        document.getElementById('searchProductDetails').addEventListener('click',productSearch);
    }
    
}
                                                            //Token Check
                                                
//Callback for User
function callBackForUser(bool,localToken,userObj){
    if(bool==true){
        var token=userObj.token;
        var res=compareToken(localToken,token);
        let welcome = document.getElementById("welcome-user");
        welcome.innerText = "Welcome: " + userObj.username;
        if(res==false){
            location.href="login.html";
        }
    }
}                                                          

                                                            //Load Offers
//Load Offers 
function loadOffers(){
    cartOperations.loadOffer(callBackForLoadOffer);
}               

//Callback for Load Offers
function callBackForLoadOffer(bool,offerObject){
    if(bool==true){
        
        let offerDiv1 = document.getElementById("offer-div-1");
        let offerDiv2 = document.getElementById("offer-div-2");
        let offerDiv3 = document.getElementById("offer-div-3");
        let i = 0;

        for(let key in offerObject){
            let object = offerObject[key];
            if(i == 0){
                offerDiv1.children[0].src = object.offer_url;
            }
            else if(i == 1){
                offerDiv2.children[0].src = object.offer_url;
            }
            else{
                offerDiv3.children[0].src = object.offer_url;
            }
            i++;
        }
    }

}

                                                            //Load Categories
//Load Categories of the Product
function loadCategories(){
    productOperations.load(callBackforLoadCategories);
}

//Callback to load Categories
function callBackforLoadCategories(bool,objCategory){
    if(bool==true){
        var arr=[];
        for(let i=0;i<objCategory.length;i++){
            cartOperations.search(callBackforProduct,objCategory[i],arr);
        }
    }
    
    setTimeout(()=>{
        for(let i=0;i<arr.length;i++){
            let result = check(arr[i].Count);
            cartOperations.search(callBackForShowProduct,result,arr[i].category,i);
        }
    },4000);
}

//Callback for Getting Product Count
function callBackforProduct(bool,prodObj,category,arr){
    if(bool==true){
        var obj={"category":category,"Count":Object.keys(prodObj).length}
       
        arr.push(obj);
    }
}

//Callback to show the Product on the H&Y Shop
function callBackForShowProduct(bool,obj,i,category){

    var productImageUrl=document.getElementsByClassName("productImageUrl");
    var productName=document.getElementsByClassName('productName');
    var view = document.getElementsByClassName("button-view");
    var cart=document.getElementsByClassName("button-cart");  

    if(bool==true){
        productImageUrl[i].src=obj.product_url;
        productName[i].innerText=obj.product_name;

        var btnID=category+"-"+obj.product_id;
        view[i].id = ``+btnID+``;
        if(document.getElementsByClassName("button-cart").length>0){
            cart[i].id=``+btnID+``;
        }
        
    }
}

                                                          //Sign Out
//Sign out Function will remove the localStorage item
function signout(){
    
    for(let key in localStorage){
        if(key.length == 9 && key[3] == "@"){
            let username=key;
            localStorage.removeItem(username);
            cartOperations.userSearch(callBackForSignOut,username,undefined);
        }
    }
}

//CallBack for Signout
function callBackForSignOut(bool,localToken,userObj){
    if(bool==true){
        delete userObj.token;
        userOperations.add(userObj);
        for(let key in localStorage){
           //Product Search Empty Details
            var arr = key.split("-");
                if(arr.length == 2 && typeof(parseInt(arr[1])) == "number"){
                    localStorage.removeItem(key);
                }
        }
        location.href="index.html";
    }
}

                                                            //View Products
//Get the Details of the Product that is to be View
function viewProduct(){
    
    var productFullID=this.id;
    var product=productFullID.split("-");
    var productCategory=product[0];
    var productID=product[1];

    var btnCart=document.getElementsByClassName('button-modal-cart')[0];
    btnCart.id=productFullID;

    
    productOperations.search(callbackforShowModal,productID,productCategory,true);
}

//To show the Product Full Details
function callbackforShowModal(bool,obj){
    if(bool==true){
        var p_name=document.getElementById("Product_Name");
        var p_price=document.getElementById("Product_Price");
        var p_desc=document.getElementById("Product_Description");
        var p_color=document.getElementById("Product_Colour");
        var p_imageUrl=document.getElementById("Product_ImageUrl");
        
        p_name.innerText=obj.product_name;
        p_price.innerText="Price :" + "\u20B9" +obj.product_price;
        p_desc.innerText="About Product :"+obj.product_desc;
        p_color.innerText="Product Colour: "+obj.product_color;
        p_imageUrl.src=obj.product_url;
    }
}

                                                            //Add to Cart
//Product add to localStorage
function addToCart(){
    var productFullID = this.id;
    var product=productFullID.split("-");
    var productCategory=product[0];
    var productID=product[1];
    var custName=document.getElementById("welcome-user").innerText;

    cartOperations.searchCart(callbackForCart,custName.split(" ")[1],productCategory,productID,true);
}

function callbackForCart(bool,cartObj,productCategory,productID){
    if(bool==true){
        cartOperations.searchCart(callbackForAddCart,cartObj.cust_name,productCategory,productID,false);
    }
    else{
        //Cart Of Username Not Exists
        var custName=document.getElementById("welcome-user").innerText;
        
        var CustObj={"cust_name":custName.split(" ")[1]};
        cartOperations.add(CustObj);
        let product={"id":productID,"qty":1};
        cartOperations.add(productCategory,productID,product,custName.split(" ")[1]);
    }
}

function callbackForAddCart(bool,cartObj,productCategory,productID){
    var custName=document.getElementById("welcome-user").innerText;
    if(bool==true){
        cartObj.qty+=1;
        cartOperations.add(productCategory,productID,cartObj,custName.split(" ")[1]);
    }
    else{
        let product={"id":productID,"qty":1};
        
        cartOperations.add(productCategory,productID,product,custName.split(" ")[1]);
    }
}


                                                                //Search
//Product Search
function productSearch(){
    localStorage.setItem("counter","1");
    for(let key in localStorage){
        var arr=key.split("-");
        if(arr.length == 2 && typeof(parseInt(arr[1])) == "number"){
            localStorage.removeItem(key);
        }
    }
    var nameProd=document.getElementById("enterProduct");
    if(nameProd.value==""){
        
        nameProd.placeholder="Enter Details";
        nameProd.className="form-control mr-sm-2 searchNotFound";
    }
    else{
        productOperations.load(callBackforCategory);
    }
}

//Callback For Category
function callBackforCategory(bool,catObj){
    var prodName=document.getElementById("enterProduct").value;
    if(bool == true){
        var categories = catObj;
        for(let category of categories){
            cartOperations.search(callbackForProductDetailsForSearch,category,prodName);
            
        }

        var nameProd=document.getElementById("enterProduct");
        setTimeout(()=>{

            for(let key in localStorage){
                
                if(key == "counter" && localStorage[key] == '1'){
                    
                    nameProd.value="";
                    nameProd.placeholder="Product Not Found";
                    nameProd.className="form-control mr-sm-2 searchNotFound";
                    break;
                } 
                else{
                    nameProd.value="";
                    nameProd.placeholder="Search";
                    nameProd.className="form-control mr-sm-2 searchFound";
                }
            }
            if(parseInt(localStorage.getItem("counter")) > 1){
                location.href="portfolio.html";
            }
            
        },4000);
    }
}

//Callback for Product Details
function callbackForProductDetailsForSearch(bool,prodObj,category,prodName){

    if(bool == true){
        for (let product in prodObj){
            let obj = prodObj[product];
            if(obj.product_name == prodName){
    
                let count = localStorage.getItem("counter");
                localStorage.setItem(category+"-"+count,JSON.stringify(obj));
                count++;
                localStorage.setItem("counter",count);
                
            }
        }
    }
}        