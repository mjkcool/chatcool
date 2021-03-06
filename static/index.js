const toHomeBtn = document.querySelector("#ToHomeBtn");
const toJoinBtn = document.querySelector("#ToJoinBtn");
const toCreateBtn = document.querySelector("#ToCreateBtn");

if(toHomeBtn) toHomeBtn.addEventListener("click", openHomeContent);
if(toJoinBtn) toJoinBtn.addEventListener("click", openJoinContent);
if(toCreateBtn) toCreateBtn.addEventListener("click", openCreateContent);

let tab1 = document.querySelector("#tab1");
let tab2 = document.querySelector("#tab2");
let tab3 = document.querySelector("#tab3");

// $(".disableipAddress").attr('value', location.hostname);

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

function joinRoom(){
    let $port = $('#joinroomport').val();
    let $name = $('#join-nickname').val();
    location.href = `joinchat?port=${$port}&nickname=${$name}`;
}

function enterRoom(){
    if( $("#createform").form('is valid')) {
        let $port = $("#createroomport").val();
        let $name = $("#host-nickname").val();
        location.href = `createchat?port=${$port}&nickname=${$name}`;
        
    }
}



