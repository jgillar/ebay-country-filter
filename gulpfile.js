//there are probably way too many plugins here
//this was my first gulp script and I got way too excited
//I should clean this up eventually
var 	gulp = require("gulp"),
		browserSync = require("browser-sync"),
		download = require("gulp-download"),
		rename = require("gulp-rename"),
		inject = require('gulp-inject'),
		print = require("gulp-print"),
		clean = require("gulp-clean"),
		tap = require("gulp-tap"),
		gutil = require("gulp-util"),
		file = require("gulp-file")
;

//clean out the tests directory
gulp.task('clean', function () {
	return gulp.src('tests', {read: false})
		.pipe(clean());
});

//reload when the userscript is changed since that's the only important file here
gulp.task("browser-sync", function(){
	browserSync.init("app/ecf.user.js", {
		server: {
			baseDir: "./",
			index: "tests/index.html"
		},
		browser: "google chrome"
	});
});

//download some html pages to check the script against
//this only needs to be run once
gulp.task('generate-tests', function() { 
		//these are some very simple tests to see if the script's filter is working
		var queries = [
			"1",
			"flower pen", //tons of items from china/hk
			"a course in combinatorics", //no items from china
			"this is something with 0 search results", //0 results, script should not crash
		];

		//keep track of page names to make an idex file
		var pageList = [];

		var stream = 
			download(
				queries.map(function(val){
					return "http://www.ebay.com/sch/i.html?_sacat=0&_nkw=" + val.replace(/ /g, "+");
				})
			)
			.pipe(
				//inject userscript into the page
				inject(
					gulp.src("app/ecf.user.js"), 
					{starttag: "</div></body>", endtag: "</html>"}
				)
			)
			.pipe(
				//rename the page to test_search_query.html
				rename(function(path){
					path.basename = ("test " + path.extname.substring(path.extname.lastIndexOf("=")+1)).replace(/ /g, "_");
					path.extname = ".html";
					return path;
				})
			)
			.pipe(
				//add the renamed file to our list of pages
				tap(function(file) {
					pageList.push(file.basename);
				})
			)
			.pipe(gulp.dest("tests/"));

		//build index.html 
		stream.on("end", function(){
				gutil.log("pageslist\n");
				gutil.log(pageList);

				var htmlstr = "<html><head><title>ECF Tests</title></head><body><ul>";

				pageList.forEach(function(page, index){
					htmlstr += `<li><a href="tests/${page}">${page}</a></li>`;
				});

				htmlstr += "</ul></body></html>";

				gutil.log(htmlstr);

				file("index.html", htmlstr, {src: true})
				.pipe(gulp.dest('tests'));

				//beep
				gutil.beep();
		});
});

gulp.task("default", ["browser-sync"]);
gulp.task("test", ["clean", "generate-tests"]);