

new Promise(function (resolve, reject){
    setTimeout(function(){
        console.log("hey");
        resolve({username: "krrish", age: 15})
    }, 1000)
})
.then(function(user){
    console.log(user.username)
});
