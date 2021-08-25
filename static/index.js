const toHomeBtn = document.querySelector("#ToHomeBtn");
const toJoinBtn = document.querySelector("#ToJoinBtn");
const toCreateBtn = document.querySelector("#ToCreateBtn");

if(toHomeBtn) toHomeBtn.addEventListener("click", openHomeContent);
if(toJoinBtn) toJoinBtn.addEventListener("click", openJoinContent);
if(toCreateBtn) toCreateBtn.addEventListener("click", openCreateContent);

let tab1 = document.querySelector("#tab1");
let tab2 = document.querySelector("#tab2");
let tab3 = document.querySelector("#tab3");

function openHomeContent(){ //tab1
    if(tab1.classList.contains("hide")) tab1.classList.remove("hide");
    if(!tab2.classList.contains("hide")) tab2.classList.add("hide");
    if(!tab3.classList.contains("hide")) tab3.classList.add("hide");
}

function openJoinContent(){ //tab2
    if(tab2.classList.contains("hide")) tab2.classList.remove("hide");
    if(!tab1.classList.contains("hide")) tab1.classList.add("hide");
    if(!tab3.classList.contains("hide")) tab3.classList.add("hide");
}

function openCreateContent(){ //tab3
    if(tab3.classList.contains("hide")) tab3.classList.remove("hide");
    if(!tab2.classList.contains("hide")) tab2.classList.add("hide");
    if(!tab1.classList.contains("hide")) tab1.classList.add("hide");
}

$("#createform").form({
    fields: {
        port: ['empty', 'exactLength[4]', 'integer'],
        nickname: 'empty'
    }
});

function enterRoom(){
    if( $("#createform").form('is valid')) {
        let $port = $("#createroomport").val();
        let $name = $("#hostname").val();
        console.log($port);
        $.ajax({
            url: '/chat',
            type: 'POST',
            data: {port: $port, hostname: $name},
            dataType: 'json',
            success: function(data) { 
                location.href = `/${data.url}`;
            },
            error: function(request,status,error){
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            }
        });
    }
}



