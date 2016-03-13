/*
ebay Country Filter

Attempts to clear up unwanted items in your ebay search results
by hiding items being sold from certain countries

A work in progress

Todo: 
	Clean up debugging text
	Switch from prompt to textbox in filter div
	Add proper userscript heading
	Support for languages other than English? 
	Sooooooo much more
*/

(function(){
//localStorage.setItem("ecfCountriesList", null);
var totalHidden = 0;
var countriesList = JSON.parse(localStorage.getItem("ecfCountriesList"));
var enabled = localStorage.getItem("ecfEnabled");

//if getItem returns null then this is the first time the script it being used
if(countriesList === null){
	countriesList = [];
}
if(enabled === null){
	enabled = false;
	localStorage.setItem("ecfEnabled", false);
}

console.log("\nafter");
console.log(countriesList);
console.log(enabled);

//insert the markup into the sidebar with the other default filters
//the html here is complicated mostly because I wanted to keep the same aesthetics
//as the rest of the page
var enableText = "\
	<div id='ecf_controls'> \
	<div class='asp asp-left-nav'> \
	<div class='pnl-h'> \
	<h3>Country Filter - Enable</h3>\
	<div class='pnl-b pad-bottom'>\
		<div class='cbx'> \
			<span class=''> \
				<input type='checkbox' name='ecf_enable' id='ecf_enable' value='enable' class='cbx' " + (enabled ? "checked" : "") + "> \
				<label for='ecf_enable'><span class='cbx'>Enabled</span></label> \
			</span> \
		</div> \
	</div> \
	</div> \
	</div> \
	</div> \
	</div> \
	";

enableText += "\
	<div id='ecf_countries'> \
	<div class='asp asp-left-nav'> \
	<div class='pnl-h'> \
	<h3>Country Filter - List</h3>\
	<div class='pnl-b pad-bottom'>\
	<div id='ecf_countries_list'></div> \
	<a id='ecf_add'>Add New Country</a> \
	</div> \
	</div> \
	</div> \
	</div> \
	</div> \
	";

$(".lct-lnks").eq(0).after(enableText);

$("#ecf_add").on("click", function(){
	var val = prompt("Enter country name");
	var valStripped = val.replace(" ", "");

	addCountry(val);

	$("#ecf_countries_list").append(" \
		<div class='cbx'> \
			<span class=''> \
				<input type='checkbox' name='ecf_" + valStripped + "' id='ecf_" + valStripped + "' value='" + val + "' class='cbx'> \
				<label for='ecf_" + valStripped + "'><span class='cbx'>" + val + "</span></label> \
			</span> \
		</div> \
		");
});

var addCountry = function(country){
	countriesList.push(country);
	console.log(countriesList);

	localStorage.setItem("ecfCountriesList", JSON.stringify(countriesList));
	console.log("HEYEEEEEEY" + localStorage.getItem("ecfCountriesList"));
};

$("#Results").on("click", ".ecf_expander", function(){
	$(this).next().slideToggle(550, "swing");
});

$("#ecf_enable").on("click", function(){
	if(enabled == true){
		enabled = false;
		localStorage.setItem("ecfEnabled", false);
		//hide the country filter - list div
	}
	else{
		enabled = true;
		localStorage.setItem("ecfEnabled", true);
		//show the country filter - list div
	}
});

$(".lvresult ").each(function(index,obj){
	return false;

	var locText = obj.textContent.trim();
	var regex = new RegExp("/(?:From )(?:China|Hong Kong)/i");

	if(regex.test(locText) ){
		//add wrapper and expand button
		obj.innerHTML = "<div class='ecf_expander'>[+] Hidden - Click to expand</div><div class='ecf_wrapper'>" + obj.innerHTML + "</div>";
		$(this).addClass("ecf_hidden");
		totalHidden++;
	}

console.log("\n");

});

console.log("Total Hidden: " + totalHidden + "\n");

var sheet = (function() {

	var style = document.createElement("style");

	//for webkit
	style.appendChild(document.createTextNode(""));

	document.head.appendChild(style);

	return style.sheet;
})();

sheet.addRule(".ecf_wrapper", "background: #333333; border: 5px solid brown; overflow: auto");
sheet.addRule(".ecf_expander", "cursor: pointer; height: 1.5em; line-height: 1.5em; color: #555; background-color: #fafafa; border: ");
sheet.addRule(".ecf_hidden .ecf_wrapper", "background: #cccccc; display: none;");
sheet.addRule(".ecf_controls", "background:brown; border:1px solid #333");
sheet.addRule("#ecf_add", "display:block; margin-top: 6px");
})();
