$(".lvresult ").each(function(index,obj){

var locText = obj.textContent.trim();
var regex = new RegExp("(?:From )(?:China|Hong Kong)");

if(regex.test(locText) ){

$(this).css("background-color", "#cccccc");

}

console.log("\n")

}).eq();
