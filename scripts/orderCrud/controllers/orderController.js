window.addEventListener("load",registerEvent);

function registerEvent(){
    checkUserToken();
    document.getElementById("signOut").addEventListener('click',signout);
    document.getElementById('order_search').addEventListener('click',search);
    showOrder();
}
                                                          //Token Check
                                                
//Callback for Admin
function callBackForadmin(bool,localToken,adminObj){
    if(bool==true){
        var token=adminObj.token;
        var res=compareToken(localToken,token);
        if(res==false){
            location.href="login.html";
        }
    }
}  



                                                            //LOAD ORDERS 

//TO Show all the order on Load
function showOrder(){
    var path="/orders/";
    orderOperations.newSearch(callBackForOrder,path);
}

//Callback for Getting Orders from the database
function callBackForOrder(bool,obj){
    if(bool==true){
        printMultipleRecords(obj)
    }
    else{
        alert("There are no Orders Placed Yet!!");
    }
}

//CallBack for User Information!
function callBackForUser(bool,obj){
   
    if(bool==true){
        printUserData(obj);
    }
}

//Callback for Cart
function callBackForCart(bool,obj){
    if(bool==true){
        collectProduct(obj);

    }
}

//Callback for Product
function callBackForProduct(bool,obj,category,quantity){
    if(bool==true){
        printProductData(obj,category,quantity);
    }
}

//Collect Product
function collectProduct(cartObject){
    for(let key in cartObject){
        let productDoc = cartObject[key];
        let productCategory = key;
        for(let newKey in productDoc){
            let product = productDoc[newKey];
            for(let lastKey in product){
                if(lastKey == "id"){
                    var id = product[lastKey];
                }
                else{
                    var quantity = product[lastKey];
                }
            }
            
            orderOperations.newSearch(callBackForProduct,productCategory,id,quantity);
        }
    }
}

//callBackAfterUpdateStatus
function callBackAfterUpdateStatus(bool,orderObj){
    if(bool==true){
        printMultipleRecords(orderObj);
    }
    else{
        alert("There are no Orders Placed Yet!!");
    }
}

//Callback for offer
function callBackForOffer(bool,offerObj,priceArr){
    if(bool==true){
        calculateFinalAmt(priceArr,offerObj.offer_price);
    }
    else{
        calculateFinalAmt(priceArr,0);   
    }
}
//CallBack For Search Order
function callBackForSearchOrder(bool,obj){
    if(bool==true){
        document.getElementById("searching").value="";
        removeDynamicDiv();
        printOneRecord(obj);
    }
    else{
        alert("Invalid Order Id!");
        document.getElementById("searching").value="";
    }
}

//Search Order
function search(){
    var o_id=document.getElementById("searching").value;
    if(o_id==""){
        alert("Please Enter the Order ID");
    }
    else{
        var path="/orders/"+o_id;
        orderOperations.newSearch(callBackForSearchOrder,path);
    }

}

                                            /***************  SIGN OUT  ***************/
//Sign out Function will remove the localStorage item
function signout(){
    
    for(let key in localStorage){
        if(key.length == 6 && typeof(parseInt(key[key.length-1])) == "number"){
            let username=key;
            localStorage.removeItem(username);
            
            adminOperations.adminSearch(callBackForSignOut,username,undefined);
        }
        
    }
}

//CallBack for Signout
function callBackForSignOut(bool,localToken,adminObj){
    if(bool == true){
        delete adminObj.token;
        adminOperations.add(adminObj);
        location.href="login.html";
    }
}
                                                            //UTILITIES

//PRINT ONE RECORD:
function printOneRecord(obj){
    removeTbody();

    var tbody = document.getElementById("orders");
    var row = tbody.insertRow(0);

    printCommon(obj,row,true);
}

//PRINT RECORDS:
function printMultipleRecords(obj){
    removeTbody();

    var tbody = document.getElementById("orders");
    var i = 0;

    for(let [key,value] of Object.entries(obj)){
        let row = tbody.insertRow(i);
        let temp = value;

        printCommon(temp,row,false);
        i++;
    }
}

//PRINT COMMON:
function printCommon(obj,row,bool){
    var i = 0;
    var state = true;

    for(let [key,value] of Object.entries(obj)){
        let cell = row.insertCell(i);

        if(i == 4){
            let td1 = document.createElement("td");
            

            td1.innerHTML = value;
            cell.appendChild(td1);
            if(value == "Not Delivered"){
                let td2 = document.createElement("td");
                td2.innerHTML = `<input type="checkbox">`;
                cell.appendChild(td2);
            }
            
            
            i++;

            continue;
        }
        cell.innerText = value;
        i++;
    }

    if(bool == false){
        state = false;
    }
    

    let optCell=row.insertCell(i);
    
        optCell.innerHTML= `<a href="javascript:viewOrder('`+obj.cust_name+`','`+obj.offer_apply+`','`+obj.order_date+`','`+obj.order_id+`','`+obj.order_status+`','`+obj.payMode+`')"> 
        <i class="fas fa-eye fa-lg"></i></a>   <a href="javascript:editOrder('`+obj.cust_name+`','`+obj.offer_apply+`','`+obj.order_date+`','`+obj.order_id+`','`+obj.order_status+`','`+obj.payMode+`','`+state+`')"><i class="fas fa-edit fa-lg"> </i> </a>`;  

        
}

//View Order
function viewOrder(cust_name,offer_apply,order_date,order_id,order_status,payMode){
 
    removeTbody();
    removeHr();
    removeDynamicDiv();
    
    var  arrPrice=[];
    let i=0;
    let dummyObject = new Order();
        for(let key in dummyObject){
            dummyObject[key] = arguments[i];
            i++;
        }

        if(order_status == "Delivered"){
            printOneRecord(dummyObject);
            printUserTable(cust_name);
        }
        else{
            printOneRecord(dummyObject);
            printUserTable(cust_name);
            printProductTable(order_id);

            setTimeout(()=>{
                var tbody=document.getElementById("product-tbody");
                
                for(let i=0;i<tbody.childElementCount;i++){
                    let row=tbody.children[i];
                    let price=row.children[4].innerText;
                    let quantity=row.children[6].innerText;
                    arrPrice.push(price*quantity);
                }
                orderOperations.newSearch(callBackForOffer,offer_apply,arrPrice);
            },3000);
        }
}


//Calculate Final Amount
function calculateFinalAmt(priceArr,offerPrice){
    var tbody=document.getElementById("product-tbody");
    var tr= makeTag("tr","","");
    var finalAmt=calculateTotal(priceArr);
    var totalAmt=0;
    for(let value of priceArr){
        for(let key in value){
            if(key == "Price"){
                totalAmt = totalAmt + parseInt(value[key]);
                continue;
            }
        }
    }

    for(let i=0;i<4;i++){
        if(i == 0){
            var td = makeTag("td","","");
            td.colSpan = "4";
            appendTag(tr,td);
            continue;
        }
        else if(i == 1){
            var td = makeTag("td","","");
            td.innerText = "Total: " + finalAmt;
            appendTag(tr,td);
        }
        else if(i == 2){
            var td = makeTag("td","","");
            td.innerText = "Offer Price: " + offerPrice;
            appendTag(tr,td);
        }
        else{
            var td = makeTag("td","","");
            td.innerText = "Final Amount: " + (finalAmt-offerPrice);
            appendTag(tr,td);
        }
    }
    
    appendTag(tbody,tr);
}

//CALCULATE TOTAL:
function calculateTotal(arrPrice){
    var sum = 0;
    for(i = 0;i<arrPrice.length;i++){
        sum = sum + arrPrice[i];
    }
    //arr.reduce((acc=0,ele)=>acc+=ele);
    return sum;
}

//User Table
function  printUserTable(cust_name){
    var div=document.getElementById("dynamic-div");
    var hr = makeTag("hr","","dynamic-hr");
    appendTag(div,hr);

    var dynamicDiv = makeTag("div","","new-dynamic-div");
    var userTable = makeTag("table","table table-bordered","userDetails");
    var thead = makeTag("thead","thead-dark","");
    var tr1 = makeTag("tr","","");
    var th = makeTag("th","","");

    th.colSpan = "5";
    th.innerText = "User Details";
    th.style.textAlign = "center";
    appendTag(tr1,th);

    var tr2 = makeTag("tr","","");
    var arr = ["Address","Email Id","Phone Number","Username"];
    for(let i=0;i<arr.length;i++){
        let th = document.createElement("th");
        th.innerText = arr[i];
        tr2.appendChild(th);
    }

    appendTag(thead,tr1);
    appendTag(thead,tr2);
    appendTag(userTable,thead);
    appendTag(dynamicDiv,userTable);
    appendTag(div,dynamicDiv);

    var path="/users/"+cust_name;
    orderOperations.newSearch(callBackForUser,path);
    //orderOperations.search(callBackForUser,cust_name,false);
}

//Print Product Table
function printProductTable(order_id){
    var dynamicDiv = document.getElementById("new-dynamic-div");
    var productTable = makeTag("table","table table-bordered","productDetails");
    var tbody = makeTag("tbody","","product-tbody");    
    var thead = makeTag("thead","thead-dark","");
    var tr1 = makeTag("tr","","");
    var th = makeTag("th","","");

    th.colSpan = "7";
    th.innerText = "Product Details";
    th.style.textAlign = "center";
    appendTag(tr1,th);

    var tr2 = makeTag("tr","","");
    var arr = ["Product Category","Product Color","Product Id","Product Name","Product Price","Product URL","Quantity"];
    for(let i=0;i<arr.length;i++){
        let th = document.createElement("th");
        th.innerText = arr[i];
        tr2.appendChild(th);
    }

    appendTag(productTable,tbody);
    appendTag(thead,tr1);
    appendTag(thead,tr2);
    appendTag(productTable,thead);
    appendTag(dynamicDiv,productTable);

    var path="/cartRef/"+order_id;
    orderOperations.newSearch(callBackForCart,path);
    //orderOperations.cart(callBackForCart,order_id);

}

//Print User Details
function printUserData(obj){
    var table = document.getElementById("userDetails");
    var tbody = makeTag("tbody","","user-tbody");
    var tr = makeTag("tr","","");

    for(let key in obj){
        if (key == "token"){
            continue;
        }
        if(key == "password"){
            continue;
        }
        
        let td = makeTag("td","","");
        td.innerText = obj[key];
        appendTag(tr,td);
    }

    appendTag(tbody,tr);
    appendTag(table,tbody);
}

//Print Product Details
function printProductData(productObject,productCategory,productQuantity){
    var table = document.getElementById("productDetails");
    var tbody=document.getElementById("product-tbody");
    
    var tr = makeTag("tr","","");
    var td = makeTag("td","","");
    td.innerText = productCategory;

    appendTag(tr,td);

    for(let key in productObject){
        if(key == "product_desc"){
            continue;
        }
        if(key == "product_url"){
            let td2 = makeTag("td","","");
            td2.style.padding = "0px";
            let img = makeTag("img","","");
            img.style.width = "200px";
            img.style.height = "150px"
            img.src = productObject[key];
            appendTag(td2,img);
            appendTag(tr,td2);
            continue;
        }
        let td1 = makeTag("td","","");
        td1.innerText = productObject[key];
        appendTag(tr,td1);
    }
    var td = makeTag("td","","");
    td.innerText = productQuantity;
    appendTag(tr,td);

    appendTag(tbody,tr);
    appendTag(table,tbody);
}

//EDIT ORDER:
function editOrder(cust_name,offer_apply,order_date,order_id,order_status,payMode,bool){
    var tbody = document.getElementById("orders");

    if(bool == "true"){
        let tr = tbody.firstChild;

        let orderObject = checkOrderStatus(arguments,tr);
        if(orderObject == undefined){
            alert("There is no change in the state of Order Status");
        }
        else{
            orderOperations.add(orderObject);
            cartOperations.addOrderProducts(order_id,{});
            printOneRecord(orderObject);
            
        }
    }
    else{
        for(let i=0;i<tbody.childElementCount;i++){
            let tr = tbody.children[i];
            let newOrderId = tr.children[3].innerText;
    
            if(newOrderId == order_id){
                let orderObject = checkOrderStatus(arguments,tr);
                if(orderObject == undefined){
                    alert("There is no change in the state of Order Status");
                }
                else{
                    orderOperations.add(orderObject);
                    cartOperations.addOrderProducts(order_id,{});
                    var path="/orders/"
                    orderOperations.newSearch(callBackAfterUpdateStatus,path);
                   
                }
            }
        }
    }
}

//CHECK ORDER STATUS:
function checkOrderStatus(arguments,tr){
    var newOrderStatus = tr.children[4];
    var td = newOrderStatus.children[1];
    var checkbox = td.firstChild;

    if(checkbox.checked == true){
        let statusText = newOrderStatus.children[0].innerText;

        if(statusText == "Delivered"){
            arguments[4] = "Not Delivered";
        }
        else{
            arguments[4] = "Delivered";
        }

        let orderObject = new Order();
        let i = 0;
        for(let key in orderObject){
            orderObject[key] = arguments[i];
            i++;
        }
        return orderObject;
    }
    return undefined;
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

//Remove Table Body
function removeTbody(){
    var tbody=document.getElementById("orders");
    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
 }

//DELETE DYNAMIC DIV:
function removeDynamicDiv(){
    if(document.getElementById("new-dynamic-div")){
        document.getElementById("new-dynamic-div").remove();
    }
}

//REMOVE HORIZONTAL LINE:
function removeHr(){
    var div = document.getElementById("dynamic-div");
    var hr = document.getElementById("dynamic-hr");

    if(document.getElementById("dynamic-hr")){
        div.removeChild(hr);
    }
}

