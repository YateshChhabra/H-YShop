function checkRegex(inputArr){
    
    var username = new RegExp("^([a-zA-z]{3})+@([a-zA-Z0-9]{5})$");
    var phoneNumber = new RegExp("^[+91-]+[0-9]{10}$");
    var email = new RegExp("^[A-Za-z0-9]+@[a-z]+.[a-z]{2,}$");
    var address = new RegExp("^([a-zA-z]{4,15})+[ ]([a-zA-Z]{4,8})+[,]([a-zA-Z]{3,15})+[-]([0-9]{6})$");
    

    var arrPattern=[
        {"username":username},
        {"phoneNumber":phoneNumber},
        {"address":address},
        {"email":email}
    ];
    var arr=[];
    for(let i=0;i<4;i++){
        let type=inputArr[i].value;
        
        for(let value of arrPattern){
            if(Object.keys(value)[0]==inputArr[i].id){
            
                let regex=value[Object.keys(value)[0]];
                
                if(regex.test(type)){
                    arr.push(true);
                }
                else{
                    arr.push(false);
                }
            }   
        }
    }
    return arr;
}