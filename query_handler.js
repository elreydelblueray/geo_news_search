$('document').ready(function() {

    // when somebody enters a toponym
    document.getElementById("toponym").onkeyup = function () {
        queryProcess();
    }



    function queryProcess() {

        if (document.getElementById("toponym").value.length > 1) {
            var toponymQuery = document.getElementById("toponym").value;
            queryToponymAtGoogle(toponymQuery, function (toponymResult, searchEngine) {
                var toponyms = [];

                if (searchEngine == "google") {
                    var addressComponents = JSON.parse(toponymResult)['results'][0]['address_components'];
                    document.getElementById("suggestedToponyms").innerHTML = "<br><h3>Toponyms used for news query</h3>";
                    for (var k = 0; k < addressComponents.length; k++) {
                        var currentAddressComponent = addressComponents[k];
                        toponyms.push(currentAddressComponent['long_name']);
                    }
                    toponyms = eliminateDuplicates(toponyms);
                }

                for (var l = 0; l < toponyms.length; l++) {
                    var newCheckbox = "<input id= 'toponymCheckbox" + l + "' type='checkbox' name='" + toponyms[l] + "' class='toponymCheckbox' checked='true'>&nbsp;" + toponyms[l] + "<br>";
                    document.getElementById("suggestedToponyms").innerHTML += newCheckbox;
                }

                queryToponyms(toponyms);

                // when the user checks/unchecks suggested toponyms
                document.getElementById("suggestedToponyms").addEventListener('click', function (e) {
                    if (e["target"]["className"] == "toponymCheckbox") {
                        var allToponymCheckboxes = document.getElementsByClassName("toponymCheckbox");
                        var newToponyms = [];
                        for (var l = 0; l < allToponymCheckboxes.length; l++) {
                            if (allToponymCheckboxes[l].checked) {
                                newToponyms.push(allToponymCheckboxes[l].name);
                            }
                        }
                        queryToponyms(newToponyms);
                    }
                });

                function queryToponyms(toponyms) {
                    document.getElementById("newsArticles").innerHTML = "";
                    document.getElementById("newsArticles").innerHTML = "<br><h3>News articles found</h3>";

                    for (var j = 0; j < toponyms.length; j++) {
                        queryNews(toponyms[j], function (newsResult) {
                            var formattedNewsArticles = "";
                            var newsArticles = JSON.parse(newsResult)["articles"];
                            for (var i = 0; i < newsArticles.length; i++) {
                                formattedNewsArticles += "<a target='_blank' href='" + newsArticles[i]["url"] + "'>    <table><tr><td width='200px'><img src='" + newsArticles[i]["urlToImage"] + "' style='width: 150px'></td><td><b>" + newsArticles[i]["title"] + "</b><br>"
                                    + newsArticles[i]["source"]["name"] + ", " + newsArticles[i]["author"] + "</td></tr></table></a><br>";
                            }
                            document.getElementById("newsArticles").innerHTML += formattedNewsArticles;
                        });
                    }
                }
            });
        }
        else {
            document.getElementById("suggestedToponyms").innerHTML = "";
            document.getElementById("newsArticles").innerHTML = "";
        }


    }




    function queryToponymAtGoogle(toponymQuery, callback) {
        var toponymQueryReadyForURI = toponymQuery.replace(/ /g, "%20");

        var documentURI = "https://maps.googleapis.com/maps/api/geocode/json?address=" + toponymQueryReadyForURI + "&key=AIzaSyDizoHQV-qR8McTaEWwyvgIvbwOp9PP5Go&language=en";

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', documentURI, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText, "google");
            }
        };
        xobj.send(null);
    }

    function queryToponymAtHere(toponymQuery, callback) {
        var toponymQueryReadyForURI = toponymQuery.replace(/ /g, "%20");

        var documentURI = "https://maps.googleapis.com/maps/api/geocode/json?address=" + toponymQueryReadyForURI + "&key=AIzaSyDizoHQV-qR8McTaEWwyvgIvbwOp9PP5Go";

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', documentURI, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText, "google");
            }
        };
        xobj.send(null);
    }

    function queryNews(toponym, callback) {
        var newsQuery = toponym + "%20";
        var newsQueryReadyForURI = newsQuery.replace(/ /g, "%20");
        var documentURI = "https://newsapi.org/v2/everything?sources=techcrunch&apiKey=a7612bd53542440c99ac5ccdcce6af4d&page=1&q=" + newsQueryReadyForURI;

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', documentURI, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }




    function eliminateDuplicates(strings) {
        var resultStrings = [];
        for (var m = 0; m < strings.length; m++) {
            var isInResultString = false;
            for (var n = 0; n < resultStrings.length; n++) {
                if (strings[m] == resultStrings[n]) {
                    isInResultString = true;
                }
            }
            if (!isInResultString) {
                resultStrings.push(strings[m])
            }
        }
        return resultStrings;
    }


});
