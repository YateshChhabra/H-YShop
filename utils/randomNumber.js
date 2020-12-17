//Generate the Random Number for getting the Unique Product all the time
function check(count){
    for(let i=0;i>(-1);i++){
        var num = Math.floor(Math.random() * (count+1));
        if(num == 0 ){
            continue;
        }
        else{
            break;
        }
    }
    return num;
}