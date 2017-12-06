$('document').ready(function(){

    // mark all checkboxes checked
    var checkboxes = document.getElementsByClassName('topic');
    switchStateOfAllCheckboxes(true);

    // reaction when all is switched
    document.getElementById("all").onclick = function () {
        if (document.getElementById("all").checked) {
            switchStateOfAllCheckboxes(true);
        }
        else {
            switchStateOfAllCheckboxes(false);
        }
    }

    // reaction when one topic is checked or unchecked
    for (var j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].id != "all") {
            checkboxes[j].onclick = function () {
                if (allCheckboxesAreChecked()) {
                    document.getElementById("all").checked = true;
                }
                else {
                    document.getElementById("all").checked = false;
                }
            }
        }
    }

    function switchStateOfAllCheckboxes(state) {
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = state;
        }
    }

    function allCheckboxesAreChecked() {
        var allCheckboxesAreChecked = true;
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].id != "all") {
                if (!checkboxes[i].checked) {
                    allCheckboxesAreChecked = false;
                }
            }
        }
        return allCheckboxesAreChecked;
    }

});