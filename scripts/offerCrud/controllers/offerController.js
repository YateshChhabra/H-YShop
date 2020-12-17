window.addEventListener("load",registerEvents);

function registerEvents(){
    checkUserToken(false);
    document.getElementById("signOut").addEventListener('click',signout);
    document.getElementById('add').addEventListener('click',callValidateForm);
    document.getElementById("update").addEventListener("click",updateOffer);
    document.getElementById("delete").addEventListener("click",callDeleteOffer);
    document.getElementById("search").addEventListener("click",searchOffer);
    document.getElementById("show").addEventListener("click",showOffer);
    document.getElementById("deleteAll").addEventListener("click",deleteAllOffer);
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

/*CALLING FUNCTIONS:*/
function callValidateForm(){               
    validateForm(true,2);
}

function callDeleteOffer(){
    var code=document.getElementsByClassName('offer-details')[0].value;
    var tbody=document.getElementById("offers");
    
    if(tbody.childElementCount==0){
        deleteOffer(undefined,true);
    }
    else{
        var td=tbody.firstChild.children[5];
        if(td.children[1].type=="checkbox"){
            deleteOffer(undefined,false);
        }
        else{
            if(code==""){
                alert("Kindly Enter the Offer Code");
            }
            else{
                deleteOffer(undefined,true);
                removeTbody();
            }
        }
        
    }
}


                                                /***************  ADD OFFER  ***************/

/* VALIDATE FORM :*/
function validateForm(bool,decision){     
   
    emptySpan();
    emptySearch();
    removeTbody();

    var span_arr=document.getElementsByClassName("blank-fields");
    var input_array=document.getElementsByClassName("offer-details");
    
    if(input_array[0].value =='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value !='')
    {
        span_arr[0].innerText = 'Enter Offer Code to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value =='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value !='')
    {
        span_arr[1].innerText = 'Enter Offer Name to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value =='' && input_array[3].value !='' && input_array[4].value !='')
    {
        span_arr[2].innerText = 'Enter Offer Description to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value =='' && input_array[4].value !='')
    {
        span_arr[3].innerText = 'Enter Offer Price to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value =='')
    {
        span_arr[4].innerText = 'Enter Offer Image Url to proceed';
    }
    else if(input_array[0].value !='' &&  input_array[1].value !='' && input_array[2].value !='' && input_array[3].value !='' && input_array[4].value !='')
    {
        if(bool == true && decision == 2){      //(ADD CASE:1.3, )
            removeTbody();
            var input_array=document.getElementsByClassName("offer-details");
            var code=input_array[0].value;
            callForOfferSearchDuringAddOffer(code);
        }
        else if(bool == false && decision == 1){          
            addOffer();                       
            alert("Offer Updated");
            input_array[0].removeAttribute("disabled");
            emptyFields();

        }
        //When the offre details are filled and "Update" button is pressed!!
        else{                                                 
            let offerId = input_array[0].value;   
            offerOperations.search(callForOfferSearchDuringUpdateOffer,offerId,false);
        }
    }
    else{
        document.getElementById('empty-error').innerText = 'Enter required fields to proceed';
    }

}

//Callback for Search to Add Offer:
function callForOfferSearchDuringAddOffer(code){    
        offerOperations.search(callBackForAddOffer,code,false);
}

//Call for Add Offer:
function callBackForAddOffer(bool){      
    var span=document.getElementsByClassName("blank-fields")[0];

    if(bool==true){
        span.innerText="This Offer Code is Already Taken";
    }
    else{
        addOffer();        
        alert("Offer Added Successfully");
        emptyFields();
    }
}

//Object Creation :
function addOffer(){           
    var offer = new Offer();
    for(let key in offer){
        offer[key] = document.getElementById(key).value;
    }
    console.log(offer);
    offerOperations.add(offer);
}

                                            /***************  UPDATE OFFER  ***************/

//Update Offer Details :
function updateOffer(){      
    emptySpan();
    emptySearch();
    removeTbody();
    
    var input_array=document.getElementsByClassName("offer-details");
    if(input_array[0].disabled){
        validateForm(false,1);     
    }
    else{
        validateForm(false,0);     
    }
}

//Call for Updating Offer in Database
function callForOfferSearchDuringUpdateOffer(bool){     
    // Offer ID is Already Taken!!    
    if(bool == true){
        addOffer();
        alert("Offer Updated");
        emptyFields();
    }
    //Offer ID is not there in the database!!
    else{
        alert("Invalid Offer Code");
    }
}

                                                /***************  DELETE OFFER  ***************/

//To Delete offer from the database
function deleteOffer(code,bool){      
    emptySpan();
    emptySearch();
    
    if(bool == true ){  
        let code=document.getElementById("offer_code").value;
        if(code==""){                        
            alert("Enter offer COde TO delete")
        }
        else{
            offerOperations.search(callBackForDeleteOffer,code,false);
            removeInputDisabled();
        }
    }
    
    //Single Delete
    else if(bool == "false" ){                                   
        offerOperations.delete(code);
        alert("Data Deleted Successfully!!!");
        emptyFields();
        removeTbody();
        var offercode=document.getElementsByClassName("offer-details")
        offercode[0].removeAttribute("disabled");
    }       
    //Multiple Delete
    else{                                  
        let tbody=document.getElementById("offers");
        let checkboxArr = [];
        for(let i=0;i<tbody.childElementCount;i++){
            let tr = tbody.children[i];
            let checkbox = tr.lastElementChild.children[1];
            if(checkbox.checked == true){
                checkboxArr.push(tr.children[0].innerText); 
            }
        }
        if(checkboxArr.length == 0){
            alert("Select Records to delete");
        }
        else{                             
            for(let i=0;i<checkboxArr.length;i++){
                offerOperations.delete(checkboxArr[i]);
            }
            alert("Data Deleted Successfully!!!");
            removeTbody();
            showOffer();       
        }
    }
}                                    

//Callback Delete Offer
function callBackForDeleteOffer(bool){        
    if(bool==true){
        var offerCode=document.getElementsByClassName('offer-details')[0].value;
        offerOperations.delete(offerCode);
        alert("Data Deleted Successfully!!!");
        emptyFields();
    }
    else{
        alert("Invalid Offer ID");
        emptyFields();
    }
}

                                            /***************  SEARCH OFFER  ***************/

//Search OFFER call from Navigation Bar
function searchOffer(){                                                             
    emptyFields();
    emptySpan();
    removeTbody();

    var code = document.getElementById("searching").value;
    if(code==""){
        alert("Please Enter Code!! ")
    }
    else{
        offerOperations.search(callBackForOffer,code,true);    
    }
}

//Offer that is been searched and printed
function callBackForOffer(bool,offerObject){                           
    if(bool == true){
        printOneRecord(offerObject);                                        
    }
    else{
        alert("Offer Not Found");
        emptySearch();
    }
}

                                            /***************  SHOW OFFER  ***************/

//Show Category wise Offer Details
function showOffer(){                                             
   
    emptySpan();
    emptySearch();
    removeTbody();
    emptyFields();
                                                        
    offerOperations.show(callBackForShowOffer);
}

//Print Multiple Record in Table of Selected Category
function callBackForShowOffer(bool,offerObject){                       
    if(bool==true){                                                             
        printMultipleRecords(offerObject);
    }
    else{
        alert("There are no offers");          
    }
}

                                                /***************  DELETE ALL OFFER  ***************/

//Delete Category of that offer that is been Selected                                                
function deleteAllOffer(){                                                
    emptyFields();
    emptySearch();
    emptySpan();
    removeTbody();

    offerOperations.search(callBackForDeleteAll,"",false);
}

function callBackForDeleteAll(bool){
    if(bool==true){
        offerOperations.delete("");
        alert("All offers Deleted");
    }
    else{
        alert("There is no Offers to delete!")
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


                                                /***************  UTILITY  ***************/
 //To Print One Record in Table
function printOneRecord(offerObject){                                          
    var tbody= document.getElementById("offers");
    var row=tbody.insertRow(0);
    var i=0;
    for(let [key,value] of Object.entries(offerObject)){
        let cell=row.insertCell(i);
        cell.innerHTML=value;
        i++;
    }
         let opt= row.insertCell(i);
         opt.innerHTML= `<a href="javascript:editOffer('`+offerObject.offer_code+`','`+offerObject.offer_name+`','`+offerObject.offer_desc+`','`+offerObject.offer_price+`','`+offerObject.offer_url+`','`+false+`')"><i class="fas fa-edit fa-lg"></i></a>
           <a href="javascript:deleteOffer('`+offerObject.offer_code+`','`+false+`')"><i class="fas fa-trash fa-lg"></i></a>`;
    emptySearch();
        
}

//To Show Multiple Offer in Table Body from the Database
function printMultipleRecords(offerObject){ 
    console.log("Offer Object is",offerObject);                                      
    let tbody = document.getElementById("offers");
    let i=0;
    for( let [key,value] of Object.entries(offerObject)){
        let row=tbody.insertRow(i);
        let j=0;
        let temp=value;
            for(let [objKey,objValue] of Object.entries(temp)){
                let cell=row.insertCell(j);
                cell.innerHTML=objValue;
                j++;
            }
            let optCell=row.insertCell(j);
            optCell.innerHTML= `<a href="javascript:editOffer('`+temp.offer_code+`','`+temp.offer_name+`','`+temp.offer_desc+`','`+temp.offer_price+`','`+temp.offer_url+`','`+true+`')"><i class="fas fa-edit fa-lg"></i></a>
            <input  type="checkbox" class="createCheckBox" /> `;                             
        i++;
    }
}

//To Edit the Offer
function editOffer(code,name,desc,price,url,bool){                          
    var input_array=document.getElementsByClassName("offer-details");
    
    input_array[0].setAttribute("disabled","");
    for(let i=0;i<arguments.length-1;i++){
        input_array[i].value=arguments[i];
    }
    
    if(bool=="true")                                                                       
    {
        removeTbody();
        let dummyObject = new dummyOffer();
        for(let key in dummyObject){
            dummyObject[key] = document.getElementById(key).value;
        }
        console.log("Edit Offer Object is",dummyObject);
        printOneRecord(dummyObject);
    }
    
}

function removeInputDisabled(){
    
    var input_array=document.getElementsByClassName("offer-details");
    if(input_array[0].disabled==true){
        input_array[0].removeAttribute("disabled");
    }   
}

//To Empty the Input Fields of the Form and Search Bar of the navigation
function emptyFields(){
    var inputArr=document.getElementsByClassName("offer-details");
    for(let i=0;i<inputArr.length;i++){
        inputArr[i].value="";
    }
}

//To Empty the Searchbar and set the Search Category DropDown as Select Category
function emptySearch(){
    var searchBar=document.getElementById("searching");
    searchBar.value="";
}
//To empty the Error of the Input Fields
function emptySpan(){
    var spanArr=document.getElementsByClassName("blank-fields");
    var emptyErr=document.getElementById("empty-error");

    for(let i=0;i<spanArr.length;i++){
        spanArr[i].innerText="";
    }
    emptyErr.innerText="";
}

//To Empty the Table Content
function removeTbody(){
    var tbody=document.getElementById("offers");
    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
 }