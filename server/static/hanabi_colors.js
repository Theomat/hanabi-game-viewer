// CONSTANTS ---------------------------------------------------
const COLORS = ["red", "green", "blue", "yellow", "white"]
const COLOR_SWAP = {}
COLOR_SWAP.red = "red"
COLOR_SWAP.green = "green"
COLOR_SWAP.blue = "blue"
COLOR_SWAP.white = "black"
COLOR_SWAP.yellow = "orange"
// END CONSTANTS -----------------------------------------------
function colorText(text, colorName, classes) {
    var classPart = "class=\"" + classes + "\""
    if(classes == undefined){
        classPart = ""
    }
    return "<p style=\"color:" + COLOR_SWAP[colorName] + ";\"" + classPart + ">" + text + "</p>"
}