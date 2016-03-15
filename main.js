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
(function() {

	//print various debugging info, slightly more convienient than using the console sometimes
	var DEBUGON = true;

	//localStorage.setItem("ecfCountriesList", null);
	var totalHidden = 0;

	var countriesList = JSON.parse(localStorage.getItem("ecfCountriesList"));

	//localstorage ecfEnabled is a STRING. Need to convert it to a boolean
	var enabled = (localStorage.getItem("ecfEnabled") === "true");

	if (DEBUGON) {
		console.log("\ninitial storage values");
		console.log("ecfEnabled: " + enabled);
		console.log("ecfCountriesList:" + countriesList);
	}

	//if getItem returns null then this is the first time the script it being used
	if (countriesList === null) {
		countriesList = [];
	}

	if (DEBUGON) {
		console.log("\nafter storage values");
		console.log("ecfEnabled: " + enabled);
		console.log("ecfCountriesList:" + countriesList);
	}

	console.log("enabled" + enabled);
	console.log("(enabled ? \"checked\" : \"\")");
	console.log((enabled ? "checked" : ""));
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
		<div id='ecf_countries' style='display:" + (enabled ? "block" : "none") + "'> \
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

	if (countriesList.length !== 0) {
		countriesList.forEach(function(country) {
			printCountry(country);
		});
	}

	$("#ecf_add").on("click", function() {
		var val = prompt("Enter country name");

		addCountry(val);
		printCountry(val);
	});

	//adds country to master list
	var addCountry = function(country) {
		countriesList.push(country.trim());
		console.log(countriesList);

		localStorage.setItem("ecfCountriesList", JSON.stringify(countriesList));
	};

	//displays a given country on the page
	function printCountry(country) {
		var valStripped = country.replace(" ", "");
		$("#ecf_countries_list").append(" \
		<div class='cbx'> \
			<span class=''> \
				<input type='checkbox' name='ecf_" + valStripped + "' id='ecf_" + valStripped + "' value='" + country + "' class='cbx' checked> \
				<label for='ecf_" + valStripped + "'><span class='cbx'>" + country + "</span></label> \
			</span> \
		</div> \
		");
	}

	$("#Results").on("click", ".ecf_expander", function() {
		$(this).next().slideToggle(550, "swing");
	});

	$("#ecf_enable").on("click", function() {
		if (enabled == true) {
			enabled = false;
			localStorage.setItem("ecfEnabled", false);
			$("#ecf_countries").hide();
			//hide the country filter - list div
		} else {
			enabled = true;
			localStorage.setItem("ecfEnabled", true);
			$("#ecf_countries").show();
			//show the country filter - list div
		}

		if (DEBUGON) {
			console.log("ecfEnabled: " + localStorage.getItem("ecfEnabled"));
		}

	});

	//go through each item div on the page and hide it if it's from an unwanted country
	$(".lvresult ").each(function(index, obj) {
		//this DOES work but it is more convieient to skip hiding things for now
		//since it takes awhile and I'm working more on the countries list first
		return false;

		var locText = obj.textContent.trim();
		var regex = new RegExp("/(?:From )(?:China|Hong Kong)/i");

		if (regex.test(locText)) {
			//add wrapper and expand button
			obj.innerHTML = "<div class='ecf_expander'>[+] Hidden - Click to expand</div><div class='ecf_wrapper'>" + obj.innerHTML + "</div>";
			$(this).addClass("ecf_hidden");
			totalHidden++;
		}

	});

	if (DEBUGON) {
		console.log("Total Hidden: " + totalHidden + "\n");
	}


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