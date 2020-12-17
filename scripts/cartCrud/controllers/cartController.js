window.addEventListener('load',registerEvents);

function registerEvents(){
    checkUserToken(true);
    document.getElementById("signOut").addEventListener('click',signout);
    document.getElementById('searchProductDetails').addEventListener('click',productSearch);
    
    setTimeout(()=>{
        loadCart(true);
    },3500); 
    setTimeout(()=>{
        let tbody = document.getElementById("cart");
        let tbodyChild = tbody.children[0];
        let tbodyGrandSons = tbodyChild.children.length;
        if(tbodyGrandSons > 1){
            calculateSubTotal();
        }
    },4500); 
    document.getElementById("apply_offer").addEventListener('click',applyOffer);
    document.getElementById("checkout").addEventListener('click',checkOut);
    
    setTimeout(function (){
        var minusQty=document.getElementsByClassName("btn-danger");
        var plusQty=document.getElementsByClassName("btn-success");

        var products=document.getElementsByClassName("cartProduct");
        for(let minus of minusQty){
            minus.addEventListener('click',minusqty);
        }
        for(let plus of plusQty){
            plus.addEventListener('click',plusqty);
        }
        for(let prod of products){
            prod.addEventListener('click',cartProducts);
        }
        
    },4500);
    
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

                                                        //Load Cart
//Load Cart of that User
function loadCart(bool){
    var custName=document.getElementById("welcome-user").innerText;
    cartOperations.searchCart(callbackForSearchCart,custName.split(" ")[1],undefined,undefined,true);
    if(bool==false){
        setTimeout(()=>{
            let tbody = document.getElementById("cart");
            let tbodyChild = tbody.children[0];
            let tbodyGrandSons = tbodyChild.children.length;
            if(tbodyGrandSons > 1){
                calculateSubTotal();
            }
        },4000);
    }
}

//Callback for Search Cart
function callbackForSearchCart(bool,cartObj,productCategory,productId){
    var count = 0;
    for(let key in cartObj){
        count++;
    }
    if(count == 1){
        var tbody=document.getElementById("cart");
        if(tbody.childElementCount == 0){
            removeTbody();
        }
        var table=document.getElementsByClassName("table")[0];
        var h4=makeTag("h4","text-center mt-5","");
        h4.innerText="No Products are Added In the Cart";
        appendTag(table,h4);
        document.getElementById("offer_code").innerText="";
        document.getElementById("offer-message").innerText="";
        document.getElementById("checkout-message").innerText="";
    }
    else{
        if(bool==true){
            var i=0;
            for(let key in cartObj){
              if(key=="cust_name"){
                  break;
              }
              for(let newKey in cartObj[key]){
                  
                  let category=key;
                  let productId=newKey;
                  for(let product in cartObj[key][newKey]){
                    if(product == "qty"){
                        let qty=cartObj[key][newKey][product];
                        cartOperations.searchProduct(callBackForCartProduct,productId,category,qty,i);
                        i++;  
                    }
                  } 
              }
            } 
        }
        else{
            var tbody=document.getElementById("cart");
            if(tbody.childElementCount == 0){
                removeTbody();
            }
            var tbody=document.getElementById("cart");
            var tr=makeTag("tr","text-center","");
            
            var td=makeTag("td","text-center mt-5","");
            td.colSpan = "5";
            td.innerText="No Products are Added In the Cart";
            td.style="color:red";
            appendTag(tr,td);
            appendTag(tbody,tr);
        }
    }
}

//Callback for Getting the details of the user Cart
function callBackForCartProduct(bool,productObj,qty,category,i){
    if(bool==true){
        
        dynamicTbody(productObj,category);
        fillDynamicTbody(productObj,category,qty,i);
    }
    

}

//Fill the Product in the table
function fillDynamicTbody(productObj,category,qty,i){
    var tbody = document.getElementById("cart");
    var tr = tbody.children[i];
    var th = tr.children[0];
    var div = th.firstChild;
    var img = div.firstChild;

    img.src = productObj.product_url;

    var div2 = div.children[1];
    var h5 = div2.children[0];
    var name = h5.firstChild;
    var cat = div2.children[1];

    name.innerText = productObj.product_name;
    cat.innerText ="Category:" + category;
    var td = tr.children[1];
    var price = td.firstChild;
    var td2 = tr.children[2];
    var color = td2.firstChild;
    var td3 = tr.children[3];
    var div3=td3.firstChild;
    var quantity = div3.children[1];

    price.innerText ="\u20B9 "+ productObj.product_price;
    color.innerText = productObj.product_color;
    quantity.value = qty;
}

//Create the Row for Product in the table
function dynamicTbody(productObj,category){

    var tbody=document.getElementById("cart");
    
    var tr=makeTag("tr","","");
    var th=makeTag("th","","");
    th.scope="row";

    var div=makeTag("div","p-2","");
    var img=makeTag("img","img-fluid rounded shadow-sm","");//image.src
    img.width="70";
    appendTag(div,img);

    var div2=makeTag("div","ml-3 d-inline-block align-middle","");
    var h5=makeTag("h5","mb-0","");
    var aTag=makeTag("a","text-dark d-inline-block cartProduct","")//productName
    aTag.id=productObj.product_id;
    aTag.href="#";
    appendTag(h5,aTag);

    var span=makeTag("span","text-muted font-weight-normal font-italic","");//category
    appendTag(div2,h5);
    appendTag(div2,span);

    var td=makeTag("td","align-middle","");
    var strong=makeTag("strong","","");//price
    appendTag(td,strong);

    var td2=makeTag("td","align-middle","");
    var strong2=makeTag("strong","","");//color
    appendTag(td2,strong2);

    var td3= makeTag("td","align-middle text-center","");
    td3.style="width:15%";
    var div3= makeTag("div","input-group","");
    
    var btnSpanMinus = makeTag("span","input-group-btn","");
    var btnMinus=makeTag("button","btn btn-danger ","");
    var iconMinus=makeTag("i","fas fa-minus","");
    btnMinus.id=category+"-"+productObj.product_id;
    appendTag(btnMinus,iconMinus);
    appendTag(btnSpanMinus,btnMinus);
   
    
    var inputQty=makeTag("input","form-control input-number quantity","");//qty
    inputQty.type="text";
    
    inputQty.setAttribute("disabled","");

    var btnSpanPlus = makeTag("span","input-group-btn","");
    var btnPlus=makeTag("button","btn btn-success ","");
    var iconPlus=makeTag("i","fas fa-plus","");
    btnPlus.id=category+"+"+productObj.product_id;
    appendTag(btnPlus,iconPlus);
    appendTag(btnSpanPlus,btnPlus);


    appendTag(div3,btnSpanMinus);
    appendTag(div3,inputQty);
    appendTag(div3,btnSpanPlus);
    
    appendTag(td3,div3);
    

    var td4=makeTag("td","align-middle text-center","");
    var anchor=makeTag("a","text-dark removeProduct","");
    var iTag=makeTag("i","fa fa-trash ","");
    anchor.href = `javascript:remove('`+category+`','`+productObj.product_id+`')`;
    
    appendTag(anchor,iTag);
    appendTag(td4,anchor);
    
    appendTag(div,div2);
    appendTag(th,div);

    appendTag(tr,th);
    appendTag(tr,td);
    appendTag(tr,td2);
    appendTag(tr,td3);
    appendTag(tr,td4)

    appendTag(tbody,tr);
}

//MAKE TAG:
function makeTag(tagName,className,id){
    var tag = document.createElement(tagName);
    if(className == "" && id == ""){
        return tag;
    }
    else if(className != "" && id == ""){
        tag.className = className;
        return tag;
    }
    else if(className == "" && id != ""){
        tag.id = id;
        return tag;
    }
    else{
        tag.className = className;
        tag.id = id;
        return tag;
    }
}

//APPEND TAG:
function appendTag(parent,child){
    parent.appendChild(child);
}

//Minus Qty
function minusqty(){
    var custName=document.getElementById("welcome-user").innerText.split(" ")[1];
    
    var btnId=this.id.split("-");
    var category=btnId[0];
    var productId=btnId[1];
    var span=this.parentElement;
    var div=span.parentElement;
    var qty=div.children[1];
    var newQty=qty.value;

    if(newQty == 1){
        qty.value=newQty;
    }
    else{
        newQty--;
        var productObj={"id":productId,"qty":newQty};
        qty.value=newQty;
        cartOperations.add(category,productId,productObj,custName);
        calculateSubTotal();
    }
}
//Plus Qty
function plusqty(){
    var custName=document.getElementById("welcome-user").innerText.split(" ")[1];
    
    var btnId=this.id.split("+");
    var category=btnId[0];
    var productId=btnId[1];
    var span=this.parentElement;
    var div=span.parentElement;
    var qty=div.children[1];
    var newQty=qty.value;
    if(newQty == 10){
        qty.value=newQty;
    }
    else{
        newQty++;
        var productObj={"id":productId,"qty":newQty};
        qty.value=newQty;
        cartOperations.add(category,productId,productObj,custName);
        calculateSubTotal();
    }
}

//Remove Product From the cart
function remove(category,productId){
    var custName=document.getElementById("welcome-user").innerText.split(" ")[1];
    
    cartOperations.deleteCartProduct(custName,category,productId);
    removeTbody();
    loadCart(false);
    setTimeout(function (){
        var minusQty=document.getElementsByClassName("btn-danger");
        var plusQty=document.getElementsByClassName("btn-success");
        var products=document.getElementsByClassName("cartProduct");

        for(let minus of minusQty){
            minus.addEventListener('click',minusqty);
        }
        for(let plus of plusQty){
            plus.addEventListener('click',plusqty);
        }
        for(let prod of products){
            prod.addEventListener('click',cartProducts);
        }
        
    },5000);
}

//Apply Offer
function applyOffer(){
    var code=document.getElementById("offer_code").value;
    var offerMessage = document.getElementById("offer-message");
    var tbody=document.getElementById("cart");
    var tr=tbody.firstChild;
    var trLength=tr.children.length;

    if(trLength == 1){
        offerMessage.style = "color: red";
        offerMessage.innerText = "First Add Products in the Cart";
    }
   
    else{
        if(code==""){
            offerMessage.style = "color: red";
            offerMessage.innerText = "Enter Offer Code";
        }
        else{
            offerOperations.search(callBackForOfferCode,code,true);
        }
    }
   
}


//Callback for Offer code
function callBackForOfferCode(bool,obj){
    var offerMessage = document.getElementById("offer-message");
    if(bool==true){
        let offerCode = document.getElementById("offer_code");
        offerCode.setAttribute("disabled","");
        offerMessage.style = "color: green";
        offerMessage.innerText = "Offer Code Applied";
        offerAmount(obj.offer_price);
    }
    else{
        offerMessage.style = "color: red";
        offerMessage.innerText = "Invalid Offer Code";
    }
}

//Offer Discount
function offerAmount(offer_price){
    var discAmt=document.getElementById("offerDiscount");
    discAmt.innerText="\u20B9" + offer_price;
    var tot=document.getElementById("total");
    
    var total1=tot.innerText.split(" ")[1];
    var total=(total1 - offer_price);
    
    tot.innerText="\u20B9" +" "+ total;
}
    
//Calculate Total
function calculateSubTotal(){
    var subtotal=0;
    var tbody=document.getElementById("cart");
    for(let i=0;i<tbody.childElementCount;i++){
        let tr = tbody.children[i];
        let td = tr.children[1];
       let price=td.firstChild.innerText;
       let qtyTd=tr.children[3];
       let div=qtyTd.firstChild;
       var qty=div.children[1].value;
       
       var actualPrice=price.split(" ")[1];
       subtotal+=parseFloat((actualPrice*qty).toFixed(2));
    }
    var subTotal=document.getElementById("subTotal");
    subTotal.innerText="\u20B9" +" "+ subtotal;
    shippingcharges(subtotal);
    
}

function shippingcharges(subtotal){
    var shipcharges = document.getElementById("ship_handle");
    var shipping=parseFloat((subtotal*1/100).toFixed(2));
    shipcharges.innerText="\u20B9" +" "+ shipping;
    taxCalculation(subtotal,shipping);
}

function taxCalculation(subtotal,shipping){
    var tax = document.getElementById("tax");
    var taxCharges=(subtotal*7)/100;
    tax.innerText="\u20B9" +" "+ taxCharges;
    total(subtotal,shipping,taxCharges);
}

function total(subtotal,shipping,taxCharges){
    
    var total=document.getElementById("total");
    var tot=parseFloat((subtotal + shipping + taxCharges).toFixed(2));
    
    total.innerHTML  = "\u20B9" +" "+ tot;
}

                                                            //Search Poduct
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
                location.href="portfolio.html";
            }
        }
    }
}  

//Cart Product To Get Detailed Info of the Product
function cartProducts(){
    
    var p_id=this.id;
    var h5=this.parentElement;
    var div=h5.parentElement;
    var span=div.children[1];
    var p_category = span.innerText.split(":")[1];
    
    cartOperations.search(callBackForcartProduct,p_id,p_category,undefined);
}

//Callback for Cart Product
function callBackForcartProduct(bool,productObj,none,productCategory){
    
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

//Place Order
function checkOut(){
    var tbody=document.getElementById("cart");
    var checkoutMessage = document.getElementById("checkout-message");
    var paymentMessage = document.getElementById("payment-message");
    let tbodyChild = tbody.children[0];
        let tbodyGrandSons = tbodyChild.children.length;
        if(tbodyGrandSons == 1){
            checkoutMessage.innerText="No Products in the Cart";
        }
        else{
            var payMode = document.getElementById("payMode").value;
            if(payMode == "Select Mode Of Payment"){
                paymentMessage.innerText = "Select Mode of Payment"; 
                paymentMessage.style="color:red";
            }
            else{
                let path = "/orders";
                orderOperations.newSearch(callBackForPlaceOrder,path);
            }
        }
}

//CALLBACK (PLACE ORDER):
function callBackForPlaceOrder(bool,orderObject){
    var orderArr = [];
    //Order Array is for Getting Particular users Order

    var customerName = document.getElementById("welcome-user").innerText;
    
    if(bool == true){
        for(let key in orderObject){
            if(orderObject[key].cust_name == customerName.split(" ")[1]){
                orderArr.push(orderObject[key].order_id);
                continue;
            }
        }
        
        if(orderArr.length == 0){
            let emptyOrderObject = new Order();
            let finalOrderObject = fillOrderObject(emptyOrderObject,0);
            

            orderOperations.add(finalOrderObject);
            cartOperations.searchCart(callBackForCartRef,customerName.split(" ")[1],undefined,finalOrderObject.order_id,true);
        }
        else{
            //lastOrder is OrderId
            let lastOrder = orderArr[orderArr.length-1];
            let lastOrderNumber = lastOrder[9];
            let emptyOrderObject = new Order();
            let finalOrderObject = fillOrderObject(emptyOrderObject,lastOrderNumber);
            
            
            orderOperations.add(finalOrderObject);
            cartOperations.searchCart(callBackForCartRef,customerName.split(" ")[1],undefined,finalOrderObject.order_id,true);
        }
    }
    else{
        //First Order
        let object = new Order();
        let finalObject = fillOrderObject(object,0);
    
        orderOperations.add(finalObject);
        cartOperations.searchCart(callBackForCartRef,customerName.split(" ")[1],undefined,finalObject.order_id,true);
    }

    swal.fire({
        icon: 'success',
        title: 'Order Placed',
        text: 'Your order has been placed, Thank You for using H&Y Shop'
    })

    setTimeout(()=>{
        cartOperations.delete(customerName.split(" ")[1]);
        removeTbody();
        deleteAmount();
        var offerCode = document.getElementById("offer_code");
        offerCode.removeAttribute("disabled");
        var offerMessage = document.getElementById("offer-message");
        var paymentMessage = document.getElementById("payment-message");
        var paymentMode = document.getElementById("payMode");
        
        offerCode.value = "";
        offerMessage.innerText = "";
        paymentMessage.innerText = "";
        paymentMode.value = "Select Mode Of Payment";
        

        var tbody = document.getElementById("cart");
        var row = document.createElement("tr");
        var column = document.createElement("td");
        column.colSpan = "5";
        var message = document.createElement("h3");
        message.className = "text-center font-italic";
        message.style = "color: red";
        message.innerText = "Your Cart is Empty";

        column.appendChild(message);
        row.appendChild(column);
        tbody.appendChild(row);

    },3000);
}

//FILL ORDER OBJECT:
function fillOrderObject(orderObject,lastOrderNumber){
    var customerName = document.getElementById("welcome-user").innerText;
    var offerCode = document.getElementById("offer_code").value;
    
    if(offerCode == ""){
        orderObject.offer_apply = "None";
    }
    else{
        orderObject.offer_apply = offerCode;
    }
    var paymentMode = document.getElementById("payMode").value;
    var dateObject = new Date();
    var date = dateObject.getDate();
    var month = dateObject.getMonth() + 1;
    var year = dateObject.getFullYear();
    var fullDate = date + "/" + month + "/" + year;

    orderObject.cust_name = customerName.split(" ")[1];
    orderObject.order_date = fullDate;
    orderObject.order_id = customerName.split(" ")[1] +  (parseInt(lastOrderNumber) + 1);
    orderObject.order_status = "Not Delivered";
    orderObject.payMode = paymentMode;

    

    return orderObject;
}

//CALLBACK (CART REF):
function callBackForCartRef(bool,cartObject,undefined,orderId){
    if(bool == true){
        cartOperations.addOrderProducts(orderId,cartObject);
    }
}

//DELETE AMOUNT:
function deleteAmount(){
    var ul = document.querySelector("ul");
    var li = ul.children;
    for(let value of li){
        if(value.children[0].innerText == "Offer Discount"){
            value.children[1].innerText = "\u20B9" + " " + 0;
            continue;
        }
        value.children[1].innerText = "";
    }
}

//Remove Tbody  
function removeTbody(){
    var tbody=document.getElementById("cart");
    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
}