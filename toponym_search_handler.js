$('document').ready(function() {

    // when somebody enters a toponym
    document.getElementById("toponym").onkeyup = function () {
        queryProcess();
    }




    // when somebody changes topic
    var checkboxes = document.getElementsByClassName('topic');
    var topicsSelected = [];
    for (var j = 0; j < checkboxes.length; j++) {
        checkboxes[j].onchange = function () {
            topicsSelected = [];
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    topicsSelected.push(checkboxes[i].id);
                }
            }
        }
    }



    function queryProcess() {

        // ToDo: international toponyms
        if (document.getElementById("toponym").value.length > 1) {
            var toponymQuery = document.getElementById("toponym").value;
            queryToponym(toponymQuery, function (toponymResult) {
                var addressComponents = JSON.parse(toponymResult)['results'][0]['address_components'];
                var toponyms = [];
                var formattedToponyms = "Toponyms used for news query: <br>";
                for (var k = 0; k < addressComponents.length && k < 4; k++) {
                    var currentAddressComponent = addressComponents[k];
                    toponyms.push(currentAddressComponent['short_name']);
                }
                toponyms = eliminateDuplicates(toponyms);
                for (var l = 0; l < toponyms.length; l++) {
                    formattedToponyms += "<input type='checkbox' class='toponym' checked='true'>" + toponyms[l] + "<br>";
                }
                document.getElementById("suggestedToponyms").innerHTML = formattedToponyms;

                // ToDo: All toponyms
                queryNews(toponyms[0], [], function (newsResult) {
                    var newsArticles = JSON.parse(newsResult)["articles"];
                    console.log(newsArticles);
                    var formattedNewsArticles = "<b>News articles found</b><br><br>";
                    for (var i = 0; i < newsArticles.length; i++) {
                        formattedNewsArticles += "<a target='_blank' href='" + newsArticles[i]["url"] + "'>    <table><tr><td width='200px'><img src='" + newsArticles[i]["urlToImage"] + "' style='width: 150px'></td><td><b>" + newsArticles[i]["title"] + "</b><br>";
                        formattedNewsArticles += newsArticles[i]["source"]["name"] + ", " + newsArticles[i]["author"] + "</td></tr></table></a><br>";
                    }
                    console.log(formattedNewsArticles);
                    document.getElementById("newsArticles").innerHTML = formattedNewsArticles;

                })



            });
        }
        else {
            document.getElementById("suggestedToponyms").innerHTML = "";
        }


    }





    function queryToponym(toponymQuery, callback) {
        var toponymQueryReadyForURI = toponymQuery.replace(/ /g, "%20");

        var documentURI = "https://maps.googleapis.com/maps/api/geocode/json?address=" + toponymQueryReadyForURI + "&key=AIzaSyDizoHQV-qR8McTaEWwyvgIvbwOp9PP5Go";

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', documentURI, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    function queryNews(toponym, topics, callback) {
        var newsQuery = toponym + "%20";
        // ToDo: Topics
        /*
        if (topics[0] != "all") {
            for (var i = 0; i < topics.length; i++) {
                newsQuery += topics[i];
            }
        }
        */
        var newsQueryReadyForURI = newsQuery.replace(/ /g, "%20");
        var documentURI = "https://newsapi.org/v2/everything?sources=techcrunch&apiKey=a7612bd53542440c99ac5ccdcce6af4d&page=1&q=" + newsQueryReadyForURI;

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', documentURI, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
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