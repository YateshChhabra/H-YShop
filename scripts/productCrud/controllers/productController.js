window.addEventListener("load",registerEvents);

function registerEvents(){
    checkUserToken(false);
    document.getElementById("signOut").addEventListener('click',signout);
    document.getElementById('add').addEventListener('click',callValidateForm);
    document.getElementById("update").addEventListener("click",updateProduct);
    document.getElementById("delete").addEventListener("click",callDeleteProduct);
    document.getElementById("search").addEventListener("click",searchProduct);
    document.getElementById("show").addEventListener("click",callShowProduct);
    document.getElementById("sort").addEventListener("click",sortProduct);
    document.getElementById("deleteAll").addEventListener("click",deleteAllProduct);
    loadCategory();
}

                                                          //Token Check
                                                
//Callback for User
function callBackForadmin(bool,localToken,adminObj){
    if(bool==true){
        var token=adminObj.token;
        var res=compareToken(localToken,token);
        if(res==false){
            location.href="login.html";
        }
    }
}  


/*CALLING FUNCTIONS:*/
function callValidateForm(){                
    validateForm(true,2);

}

function callDeleteProduct(){               
    if(document.getElementById("newLabel")){
        deleteProduct(undefined,undefined,false);
    }
    else{
        deleteProduct(undefined,undefined,true);    
    }
}

function callShowProduct(){
    showProduct(true,undefined);                    
}

/*LOAD CATEGORY:*/
function loadCategory(){       
    productOperations.load(callBackForLoadCategory);
}

/*CALLBACK (LOAD CATEGORY):*/
function callBackForLoadCategory(bool,objectCategory){      
    if(bool==true){
        let obj=[];
        let show=document.getElementById("category-show");
        let search=document.getElementById("category-search");
        let select=document.getElementById("category-select");
        obj.push(show);
        obj.push(search);
        obj.push(select);
        for(let i=0;i<obj.length;i++){
            for(let value of objectCategory){
                let option=document.createElement("option");
                option.innerText=value;
                obj[i].appendChild(option);
            }
        }
    }
    else{
        alert("There are no category Kindly Add!!")
    }
}

                                                /***************  ADD PRODUCT  ***************/

/* VALIDATE FORM :*/
function validateForm(bool,decision){       //( ADD CASE:1.2,UPDATE CASE:1.3,UPDATE CASE:2.3, )
    deleteLabel();
    emptySpan();
    emptyShowcategory();
    emptySort();
    emptySearch();
    removeTbody();

    var span_arr=document.getElementsByClassName("blank-fields");
    var input_array=document.getElementsByClassName("product-details");
    
    if(input_array[0].value =='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value !='' && input_array[5].value !="" && input_array[6].value!='')
    {
        span_arr[0].innerText = 'Enter Product ID to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value =='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value !='' && input_array[5].value !="" && input_array[6].value!='')
    {
        span_arr[1].innerText = 'Enter Product Name to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value =='' && input_array[3].value !='' && input_array[4].value !='' && input_array[5].value !="" && input_array[6].value!='')
    {
        span_arr[2].innerText = 'Enter Product Description to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value =='' && input_array[4].value !='' && input_array[5].value !="" && input_array[6].value!='')
    {
        span_arr[3].innerText = 'Enter Product Price to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value =='' && input_array[5].value !="" && input_array[6].value!='')
    {
        span_arr[4].innerText = 'Enter Product Url to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value !='' && input_array[5].value =="" && input_array[6].value!='')
    {
        span_arr[5].innerText = 'Enter Product Color to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value !='' && input_array[5].value !="" && input_array[6].value=='Select Category')
    {
        span_arr[6].innerText = 'Select Category to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value !='' && input_array[5].value !="" &&  input_array[6].value!='')
    {
        if(bool == true && decision == 2){      
            removeTbody();
            callForProductSearchDuringAddProduct(input_array);
        }
        else if(bool == false && decision == 1){            
            addProduct();                         
            alert("Product Updated");
            input_array[0].removeAttribute("disabled"); 
            emptyFields();

        }
        //When the product details are filled and "Update" button is pressed!!
        else{                                                 
            let productId = input_array[0].value;   
            let productCategory = input_array[6].value;
            productOperations.search(callForProductSearchDuringUpdateProduct,productId,productCategory,false);
        }
    }
    else{
        document.getElementById('empty-error').innerText = 'Enter required fields to proceed';
    }

}

//Callback for Search to Add Product:
function callForProductSearchDuringAddProduct(input_array){     
    var p_id=input_array[0].value;
    var p_category=input_array[6].value;
        productOperations.search(callBackForAddProduct,p_id,p_category,false);
}

//Call for Add Product:
function callBackForAddProduct(bool){       
    var span=document.getElementsByClassName("blank-fields")[0];

    if(bool==true){
        span.innerText="This id is Already Taken";
    }
    else{
        addProduct();        
        alert("Product Added Successfully");
        emptyFields();
    }
}

//Object Creation :
function addProduct(){           
    var product = new Product();
    for(let key in product){
        product[key] = document.getElementById(key).value;
    }
    
    var input_array=document.getElementsByClassName("product-details")
    productOperations.add(product,input_array);
}

                                            /***************  UPDATE PRODUCT  ***************/

//Update Product Details :
function updateProduct(){       
    deleteLabel();
    emptySpan();
    emptySort();
    emptyShowcategory();
    emptySearch();
    removeTbody();
    
    var input_array=document.getElementsByClassName("product-details");
    if(input_array[0].disabled){
        validateForm(false,1);      
    }
    else{
        validateForm(false,0);      
    }
}

//Call for Updating Product in Database
function callForProductSearchDuringUpdateProduct(bool,input_array){     
    // Product ID is Already Taken!!    
    if(bool == true){
        addProduct(input_array);
        alert("Product Updated");
        emptyFields();
    }
    //Product ID is not there in the database!!
    else{
        alert("Invalid Product ID");
    }
}

                                                /***************  DELETE PRODUCT  ***************/

//To Delete product from the database
function deleteProduct(id,category,bool){       //(DELETE CASE :1.3,DELETE CASE :2.1, DELETE CASE:3.1)
    emptySpan();
    emptyShowcategory();
    emptySort();
    emptySearch();

    let arr=document.getElementsByClassName("product-details");

    if(bool == true){                           //(DELETE CASE :1.4)
        let inputID=document.getElementsByClassName("product-details")[0].value;
        let inputCategory=document.getElementsByClassName("product-details")[6].value;

        if(inputID=="" && inputCategory=="Select Category"){
            alert("Enter the Product ID and Category to delete ");
        }
        else if(inputID!="" && inputCategory=="Select Category"){
            alert("Select Category to Delete")
        }
        else if(inputID=="" && inputCategory!="Select Category"){
            alert("Please Enter the Id to Delete");
        }
        else{
            productOperations.search(callBackForDeleteProduct,inputID,inputCategory,false); //(DELETE CASE :1.5)
        }
    }
    else if(bool == "false"){               //(DELETE CASE :2.2)                       
        productOperations.delete(id,category);
        alert("Data Deleted Successfully!!!");
        emptyFields();
        removeTbody();
        deleteLabel();
        arr[0].removeAttribute("disabled");
    }       
    else{                                   //( DELETE CASE:3.2)
        let tbody=document.getElementById("products");
        let checkboxArr = [];
        let label=document.getElementById("newLabel").innerText;
        for(let i=0;i<tbody.childElementCount;i++){
            let tr = tbody.children[i];
            let checkbox = tr.lastElementChild.children[1];
            if(checkbox.checked == true){
                checkboxArr.push(tr.children[2].innerText); 
            }
        }

        if(checkboxArr.length == 0){
            alert("Select Records to delete");
        }
        else{                              //( DELETE CASE:3.3)
            for(let i=0;i<checkboxArr.length;i++){
                productOperations.delete(checkboxArr[i],label);
            }
            alert("Data Deleted Successfully!!!");
            removeTbody();
            deleteLabel();
            showProduct(false,label);       //( DELETE CASE:3.4)
        }
    }
}                                    

//Callback Delete Product
function callBackForDeleteProduct(bool){        //(DELETE CASE :1.6)
    var prodArr=document.getElementsByClassName("product-details");
    if(bool==true){
        productOperations.delete(prodArr[0].value,prodArr[6].value);
        alert("Data Deleted Successfully!!!");
        emptyFields();
    }
    else{
        alert("Invalid Product ID");
        emptyFields();
    }
}

                                            /***************  SEARCH PRODUCT  ***************/

//Search Product call from Navigation Bar
function searchProduct(){                                                               //(SEARCH CASE:1.1)
    emptyFields();
    deleteLabel();
    emptySpan();
    emptySort();
    emptyShowcategory();
    removeTbody();

    var id = document.getElementById("searching").value;
    var category=document.getElementById("category-search").value;
    if(id=="" && category=="Select Category"){
        alert("Please Select Category and Fill ID!! ")
    }
    else if(id=="" && category!="Select Category"){
        alert("Please Fill id to Search");
    }
    else if(id!="" && category=="Select Category"){
        alert("Please Select Category!!");
    }
    else{
        productOperations.search(callBackForProduct,id,category,true);    //(SEARCH CASE:1.2)
    }
}

//Product that is been searched and printed
function callBackForProduct(bool,productObject,category){                           //(SEARCH CASE:1.3)
    if(bool == true){
        printOneRecord(productObject,category);                                     //(SEARCH CASE:1.4)        
    }
    else{
        alert("Product Not Found");
        emptySearch();
    }
}

                                            /***************  SHOW PRODUCT  ***************/

//Show Category wise Product Details
function showProduct(bool,newCategory){                                             //( SHOW CASE:1.2, DELETE CASE:3.5 )
    deleteLabel();
    emptySpan();
    emptySort();
    emptySearch();
    removeTbody();
    emptyFields();

    var category=document.getElementById("category-show").value;
        if(bool==true){                                                             
            if(category=="Select Category"){
                alert("Please Select Category");
            }
            else{
                productOperations.show(callBackForShowProduct,category);
            }
        }
        else{
            productOperations.show(callBackForShowProduct,newCategory);             
        }
}

//Print Multiple Record in Table of Selected Category
function callBackForShowProduct(bool,category,productObject){                        
    if(bool==true){                                                             
        printMultipleRecords(category,productObject);
        emptyShowcategory();
    }
    else{
        alert("There is no product in this category");          
        emptyShowcategory();
    }
}


                                                /***************  SORT PRODUCT  ***************/

// Sort Product:                                                
function sortProduct(){                                             
    emptyFields();
    emptySpan();
    emptySearch();
    emptyShowcategory();
    if(document.getElementById("newLabel")){                        
        let tbody = document.getElementById("products");
        let sortBy=document.getElementById("sort-category");
        let objectArr = [];
        for(let i=0;i<tbody.childElementCount;i++){
            let object = new dummyProduct();
            objectArr.push(object);
        }
        
        for(let i=0;i<tbody.childElementCount;i++){
            let tr = tbody.children[i];
            let j=0;
            for(let[key,value] of Object.entries(objectArr[i])){
                objectArr[i][key] = tr.children[j].innerText;
                j++;
            }
        }
        if(sortBy.value == "Sort By"){                              
            alert("Select Sort By to proceed");
        }
        else if(sortBy.value == "Price: Low to High"){      
                  
            objectArr.sort((a,b)=>a["product_price"]-b["product_price"]);
            let label = document.getElementById("newLabel").innerText;
            removeTbody();
            printMultipleRecords(label,objectArr);  
            deleteLabel();
            emptySort();
        }
        else{                                                       
            objectArr.sort((a,b)=>b["product_price"]-a["product_price"]);               
            let label = document.getElementById("newLabel").innerText;
            removeTbody();
            printMultipleRecords(label,objectArr);
            deleteLabel();
            emptySort();
        }
    }
    else{
        alert("First Show the Product Category to proceed");
    }
}    

                                                /***************  DELETE ALL PRODUCT  ***************/

//Delete Category of that Product that is been Selected                                                
function deleteAllProduct(){                                                
    emptyFields();
    emptyShowcategory();
    emptySort();
    emptySearch();
    emptySpan();
    if(document.getElementById("newLabel")){
        var label = document.getElementById("newLabel").innerText;
        productOperations.delete("",label);
        alert("Product Category is deleted");
        deleteLabel();
    }
    else{
        alert("First Show the product!!");
    }
    removeTbody();
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

                                                /***************  UTILITY  ***************/
 //To Print One Record in Table
function printOneRecord(productObject,category){                                            
    let tbody= document.getElementById("products");
    let row=tbody.insertRow(0);
    let i=0;
    
    
    for(let [key,value] of Object.entries(productObject)){
        let cell=row.insertCell(i);
        cell.innerHTML=value;
        i++;
    }
         let opt= row.insertCell(i);
         opt.innerHTML= `<a href="javascript:editProduct('`+productObject.product_id+`','`+productObject.product_name+`','`+productObject.product_desc+`','`+productObject.product_price+`','`+productObject.product_url+`','`+productObject.product_color+`','`+undefined+`', '`+true+`')"><i class="fas fa-edit fa-lg"></i></a>
           <a href="javascript:deleteProduct('`+productObject.product_id+`','`+category+`','`+false+`')"><i class="fas fa-trash fa-lg"></i></a>`;
    emptySearch();
        
}

//To Show Multiple Product in Table Body from the Database
function printMultipleRecords(category,productObject){ 
                                          //(SHOW CASE:1.5, DELETE CASE:3.8)
    let div=document.getElementById("createLabel");
    let tbody = document.getElementById("products");
    let i=0;
    for( let [key,value] of Object.entries(productObject)){
        let row=tbody.insertRow(i);
        let j=0;
        let temp=value;
            for(let [objKey,objValue] of Object.entries(temp)){
                let cell=row.insertCell(j);
                cell.innerHTML=objValue;
                j++;
            }
            let optCell=row.insertCell(j);
            optCell.innerHTML= `<a href="javascript:editProduct('`+temp.product_id+`','`+temp.product_name+`','`+temp.product_desc+`','`+temp.product_price+`','`+temp.product_url+`','`+temp.product_color+`','`+category+`','`+false+`')"><i class="fas fa-edit fa-lg"></i></a><input id='`+temp.product_id+`' type="checkbox" class="createCheckBox" /> `;                             
        i++;
    }
    var label = document.createElement("label");
    label.innerText = category;
    label.id = "newLabel";
    div.appendChild(label);
   
    emptyShowcategory();

}

//To Edit the Product
function editProduct(id,name,desc,price,url,color,category,bool){                           //(SEARCH CASE:1.6,UPDATE CASE:3.1)
    var input_array=document.getElementsByClassName("product-details");
    input_array[0].setAttribute("disabled","");
    for(let i=0;i<arguments.length-2;i++){
        input_array[i].value=arguments[i];
    }
    input_array[6]="Select Category";  
    if(bool=="false")                                                                       //(UPDATE CASE:3.2)
    {
        removeTbody();
        let dummyObject = new dummyProduct();
        for(let key in dummyObject){
            dummyObject[key] = document.getElementById(key).value;
        }
        printOneRecord(dummyObject,category);
    }
    
}

//To Empty the Input Fields of the Form and Search Bar of the navigation
function emptyFields(){
    var inputArr=document.getElementsByClassName("product-details");
    for(let i=0;i<inputArr.length-1;i++){
        inputArr[i].value="";
    }
    inputArr[6].value="Select Category";
}

//To Empty the Searchbar and set the Search Category DropDown as Select Category
function emptySearch(){
    var searchCategory = document.getElementById("category-search");
    var searchBar=document.getElementById("searching");
    searchBar.value="";
    searchCategory.value="Select Category";
}
//To Set the Show Category DropDown as Select Category
function emptyShowcategory(){
    var showCategory = document.getElementById("category-show");  
    showCategory.value="Select Category";    
}

//To Set the Sort DropDown as Sort By
function emptySort(){
    var sortCategory= document.getElementById("sort-category");
    sortCategory.value="Sort By";
}

//To empty the Error of the Input Fields
function emptySpan(){
    var spanArr=document.getElementsByClassName("blank-fields");
    var emptyErr=document.getElementById("empty-error")

    for(let i=0;i<spanArr.length;i++){
        spanArr[i].innerText="";
    }
    emptyErr.innerText="";
}

//To Empty the Table Content
function removeTbody(){
    var tbody=document.getElementById("products");
    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
 }

//To delete the Dynamic Label in "createLabel" div
function deleteLabel(){
    var dynamicLabel=document.getElementById("newLabel");
    var dynamicDiv=document.getElementById("createLabel");
    if(dynamicLabel){
        dynamicDiv.removeChild(dynamicLabel);
    }
}