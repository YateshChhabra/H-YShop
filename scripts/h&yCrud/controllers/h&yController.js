window.addEventListener('load',registerEvents);

function registerEvents(){
    if(document.getElementById("signOut")){
        checkUserToken(true);
        document.getElementById("signOut").addEventListener('click',signout);
    }
    var cart=document.getElementsByClassName("button-cart");
    for(let addProduct of cart){
        addProduct.addEventListener("click",addToCart);
    }    

    var buttons = document.getElementsByClassName("button-view");
    for(let button of buttons){
        button.addEventListener("click",viewProduct);
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
    
    if(this.id == ""){
        let imgDiv = document.getElementById("empty-image");
        let pColor = document.getElementById("Product_Colour");
        let pDescription = document.getElementById("Product_Description");
        let pName = document.getElementById("Product_Name");
        let pNameParent = pName.parentElement;

        if(document.getElementsByClassName("button-modal-cart")[0]){
            let cartButton = document.getElementsByClassName("button-modal-cart")[0];
            cartButton.parentElement.removeChild(cartButton);
        }

        if(document.getElementById("Product_ImageUrl")){
            imgDiv.parentElement.removeChild(imgDiv);
        }

        pNameParent.parentElement.className = "col-lg-12";
        pColor.innerText = "Products Still Loading";
        pDescription.innerText = "Products are still loading, Please wait till the products are loaded.";
    }

    else{
        let productFullID=this.id;
        let product=productFullID.split("-");
        let productCategory=product[0];
        let productID=product[1];


        if(document.getElementsByClassName("button-modal-cart")[0]){
            let btnCart=document.getElementsByClassName('button-modal-cart')[0];
            btnCart.id=productFullID;

            productOperations.search(callbackforShowModal,productID,productCategory,true);
        }

        else{
            let newCartButton = document.createElement("button");
            newCartButton.className = "newEvent button-cart button-modal-cart btn btn-primary";
            if(document.getElementById("welcome-user")){
                newCartButton.addEventListener("click",addToCart);
                newCartButton.id = productFullID;
            }
            else{
                newCartButton.onclick = ()=>{
                    location.href = "login.html";
                };
            }
            newCartButton.innerText = "Add To Cart";

            let icon = document.createElement("i");
            icon.className = "fas fa-cart-plus ml-2";
            icon["area-hidden"] = true;
            newCartButton.appendChild(icon);

            let parentDiv = document.getElementById("button-modal");
            parentDiv.appendChild(newCartButton);

            productOperations.search(callbackforShowModal,productID,productCategory,true);
        }
    }
   
}

//To show the Product Full Details
function callbackforShowModal(bool,obj){
    var p_name = document.getElementById("Product_Name");
    var p_price = document.getElementById("Product_Price");
    var p_desc = document.getElementById("Product_Description");
    var p_color = document.getElementById("Product_Colour");
    var p_imageUrl = document.getElementById("Product_ImageUrl");
    
    if(bool==true){
        
        if(document.getElementById("Product_ImageUrl")){
            p_imageUrl.src = obj.product_url;
        }
        else{
            let div = document.createElement("div");
            div.id = "empty-image";
            div.className = "col-lg-5";

            let image = document.createElement("img");
            image.className = "d-block w-100 rounded";
            image.style = "margin-left: 0%";
            image.id = "Product_ImageUrl";
            image.src = obj.product_url;

            div.appendChild(image);
            let parentRow = document.getElementById("rowModal");
            parentRow.appendChild(div);

            let pName = document.getElementById("Product_Name");
            let pNameParent = pName.parentElement;

            pNameParent.parentElement.className = "col-lg-7";
        }
        
        
        p_name.innerText=obj.product_name;
        p_price.innerText="Price :" + "\u20B9" +obj.product_price;
        p_desc.innerText="About Product :"+obj.product_desc;
        p_color.innerText="Product Colour: "+obj.product_color;
        
    }
}

                                                            //Add to Cart
//Product add to localStorage
function addToCart(){
    if(this.id == ""){
        document.getElementsByClassName("heading")[0].innerText="Products Still Loading";
        document.getElementsByClassName("change-color")[0].innerText="Products are still loading,";
        document.getElementsByClassName("change-color")[1].innerText="Please wait till the products are loaded.";
        let pTag= document.getElementsByClassName("errorIcon")[0];
        let eIcon = document.createElement("i");
        if(pTag.firstElementChild){
            pTag.removeChild(pTag.firstElementChild);
        }
        eIcon.className="fa fa-exclamation-triangle fa-4x";
        pTag.appendChild(eIcon);
    }
    else{
        document.getElementsByClassName("heading")[0].innerText="Product Added In The Cart";
        document.getElementsByClassName("change-color")[0].innerText="Your product is added into the cart.";
        document.getElementsByClassName("change-color")[1].innerText="Thank You for the purchase.";

        let pTag= document.getElementsByClassName("errorIcon")[0];
        let eIcon = document.createElement("i");
        if(pTag.firstElementChild){
            pTag.removeChild(pTag.firstElementChild);
        }
        eIcon.className="fas fa-shopping-cart fa-4x";
        pTag.appendChild(eIcon);

        var productFullID = this.id;
        var product=productFullID.split("-");
        var productCategory=product[0];
        var productID=product[1];
        var custName=document.getElementById("welcome-user").innerText;

        cartOperations.searchCart(callbackForCart,custName.split(" ")[1],productCategory,productID,true);
        if(document.getElementsByClassName("newEvent")[0]){
            swal.fire({
                icon: "success",
                title: "Product Added In The Cart",
                text: "Your product is added into the cart. Thank You for the purchase."
            });
        }
    }
    
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