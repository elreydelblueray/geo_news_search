$('document').ready(function() {

    // when somebody enters a toponym
    document.getElementById("toponym").onkeyup = function () {
        console.log("something typed");
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
            console.log(topicsSelected);
        }
    }






});