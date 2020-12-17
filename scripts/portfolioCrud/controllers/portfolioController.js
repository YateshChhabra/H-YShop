window.addEventListener('load',registerEvents);

function registerEvents(){
    checkUserToken(true);
    var bool=true;
    for(let key in localStorage){
        let keyArr = key.split("-");
        if(keyArr.length == 2 && typeof(parseInt(keyArr[1])) == "number"){
            bool=false;
        }
    }
    if(bool==true){
        var container=document.getElementsByClassName("container")[1];
        for(let i = 0; i < 3; i++){
            container.removeChild(container.children[0]);
        }
        let message=document.createElement("div");
        let msg=document.createElement("h1");
        msg.innerText="First Search the Product!!";
        message.appendChild(msg);
        message.className="shadow p-1 mb-5 bg-white rounded "; 
        message.style="margin-top:10%";
        msg.className="text-center text-dark ";
        msg.style="margin-top :2% margin-bottom:2%";
        container.appendChild(message);
       
    }
    else{
        printProduct();
        (document.querySelectorAll(".col-md-6")[1].lastElementChild).addEventListener("click",addToCart2);
    }
    
    document.getElementById("signOut").addEventListener('click',signout);
    document.getElementById('searchProductDetails').addEventListener('click',productSearch);
    var imageAnchor=document.getElementsByClassName("relatedProducts");
    
    for(let link  of imageAnchor){
        link.addEventListener("click",showRelatedProduct);
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
           
            var arr = key.split("-");
                if(arr.length == 2 && typeof(parseInt(arr[1])) == "number"){
                    localStorage.removeItem(key);
                }
        }
        location.href="index.html";
    }
}

                                                    //PRINT PRODUCT:

//PRINT PRODUCT:
function printProduct(){
    var productArr = [];
    for(let key in localStorage){
        let keyArr = key.split("-");
        let cartProduct=key.split("_");
        if(keyArr.length == 2 && typeof(parseInt(keyArr[1])) == "number"){
            
            let stringObject = localStorage.getItem(key);
            let object = JSON.parse(stringObject);
            object.productCategory = keyArr[0];
            productArr.push(object);
        }
        
    }
    var count = productArr.length;
    var randomNumber = check(count);
    var productObject = productArr[randomNumber-1];
    
    for(let key in productObject){
        if(key == "product_url"){
            document.getElementById(key).src = productObject[key];
            continue;
        }
        if(key == "product_id"){
            continue;
        }
        if(key == "product_price"){
            document.getElementById(key).innerText = "\u20B9" + " " + productObject[key];
            continue;
        }
        document.getElementById(key).innerText = productObject[key];
    }
    var productId = productObject.product_id;
    var cart = document.getElementById("add-to-cart");
    cart.id = productId;
    productArr.splice((randomNumber-1),1);
    printRelatedProduct(productArr);
}

                                                //RELATED PRODUCT:

//PRINT RELATED PRODUCT:
function printRelatedProduct(productArr){
    var count = productArr.length;
    var section = document.querySelectorAll("section")[1];
    var image = document.querySelectorAll(".product-url");
    var name = document.querySelectorAll(".product-name");
    var price = document.querySelectorAll(".product-price");

    if(count == 0){
        let hr = document.querySelector("hr");
        let parent = section.parentElement;
        parent.removeChild(hr);
        parent.removeChild(section);
    }
    else if(count == 4){
        
        let i = 0;
        
        for(let value of productArr){
            image[i].src = value.product_url;
            image[i].id = value.productCategory+"-"+value.product_id;
            name[i].innerText = value.product_name;
            price[i].innerText = "\u20B9" + " " + value.product_price;
            i++;
        }
    }
    else if(count > 4){
        
        for(let i=0;i<4;i++){
            let newCount = productArr.length;
            let randomNumber = check(newCount);
            let productObject = productArr[randomNumber-1];
            
            for(let key in productObject){
                if(key == "product_url"){
                    image[i].src = productObject[key];
                    image[i].id = key.productCategory+"-"+key.product_id;
                    continue;
                }
                if(key == "product_name"){
                    name[i].innerText = productObject[key];
                    continue;
                }
                if(key == "product_price"){
                    price[i].innerText = "\u20B9" + " " + productObject[key];
                    continue;
                }
            }
            productArr.splice((randomNumber-1),1);
        }
    }
    else{
        
        let row = section.children[1];

        var newCount = 4 - count;
        for(let i = 1; i <= newCount;i++){
            let div = row.children[0];
            row.removeChild(div);
        }
        let lastImage = document.querySelectorAll(".product-url");
        let lastName = document.querySelectorAll(".product-name");
        let lastPrice = document.querySelectorAll(".product-price");
        for(let i=0;i<count;i++){
            lastImage[i].src = productArr[i].product_url;
            lastImage[i].id = productArr[i].productCategory+"-"+productArr[i].product_id;
            lastName[i].innerText = productArr[i].product_name;
            lastPrice[i].innerText = "\u20B9" + " " + productArr[i].product_price;
        }
    }
}                                            

//Show Related Product Details
function showRelatedProduct(){
    var image=this.children[0].id.split("-");
    var p_id=image[1];
    var p_category=image[0];
    cartOperations.search(callBackForRelatedProduct,p_id,p_category,undefined);
}

//Print Related Product Details
function callBackForRelatedProduct(bool,productObj,none,productCategory){
    if(bool == true){
        for(let key in localStorage){
            var arr=key.split("-");
            if(arr.length == 2 && typeof(parseInt(arr[1])) == "number"){
                localStorage.removeItem(key);
            }
        }
        localStorage.setItem(productCategory+"-"+productObj.product_id,JSON.stringify(productObj));
        location.href="portfolio.html";
    }
}

                                                    //ADD TO CART

//ADD TO CART:
function addToCart2(){
    var productId = document.querySelectorAll(".col-md-6")[1].lastElementChild.id;
    var productCategory = document.querySelectorAll(".col-md-6")[1].children[1].innerText;
    var customerName = document.getElementById("welcome-user").innerText;

    cartOperations.searchCart(callBackForCart2,customerName.split(" ")[1],productCategory,productId,true);
}

//CALLBACK (CART 2):
function callBackForCart2(bool,cartObject,productCategory,productId){
    if(bool == true){
        let customerName = cartObject.cust_name;
        cartOperations.searchCart(callBackForAddCart2,customerName,productCategory,productId,false);
    }
    else{
        let customerName = document.getElementById("welcome-user").innerText;
        let customerObject = {"cust_name":customerName.split(" ")[1]};
        cartOperations.add(customerObject);

        let productObject = {"id":productId,"qty":1};
        cartOperations.add(productCategory,productId,productObject,customerName.split(" ")[1]);
    }
}

//CALLBACK (ADD CART 2):
function callBackForAddCart2(bool,cartObject,productCategory,productId){
    console.log(arguments);
    if(bool == true){
        let customerName = document.getElementById("welcome-user").innerText;
        cartObject.qty++;
        cartOperations.add(productCategory,productId,cartObject,customerName.split(" ")[1]);
    }
    else{
        let customerName = document.getElementById("welcome-user").innerText;
        let productObject = {"id":productId,"qty":1};
        cartOperations.add(productCategory,productId,productObject,customerName.split(" ")[1]);
    }
}