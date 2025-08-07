function opentable(){

    var rows=document.getElementsByTagName("input")[0].value;
    var cols=document.getElementsByTagName("input")[1].value;
    let newtable=document.createElement("table");
    newtable.setAttribute("border","1");
    newtable.setAttribute("cellspacing","0");
    var parent=document.getElementsByTagName("body")[0];
    parent.appendChild(newtable);
    
    for(var i=0;i<rows;i++){
        let newrows=document.createElement("tr");

        var rowparent=document.getElementsByTagName("table")[0];
        rowparent.appendChild(newrows);
    }

    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            let newdata=document.createElement("td");
            newdata.setAttribute("width","70px");
            newdata.setAttribute("height","70px");
            newdata.setAttribute("style","background-color:skyblue");
            var dataparent=document.getElementsByTagName("tr")[i];
            dataparent.appendChild(newdata);
        }
    }
    var imageparent=document.getElementsByTagName("td")[0];
    var imagee=document.createElement("img");
    imagee.setAttribute("src","./bubu-walk.gif");
    imagee.setAttribute("width","60px");
    imagee.setAttribute("height","60px");
    imageparent.appendChild(imagee);

    let left=document.createElement("button");
    left.innerText="Left";
    left.setAttribute("class","left");
    left.setAttribute("onclick","moveleft()");
    parent.appendChild(left);

    let right=document.createElement("button");
    right.innerText="right";
    right.setAttribute("class","right");
    right.setAttribute("onclick","moveright()");
    parent.appendChild(right);

    let top=document.createElement("button");
    top.innerText="top";
    top.setAttribute("class","top");
    top.setAttribute("onclick","movetop()");
    parent.appendChild(top);
    
    let bottom=document.createElement("button");
    bottom.innerText="bottom";
    bottom.setAttribute("class","bottom");
    bottom.setAttribute("onclick","movebottom()");
    parent.appendChild(bottom);
}
