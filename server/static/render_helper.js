

function produce_list(array, bonus_class = ""){
    const head = "<ul class=\"list-group list-group-flush list-group-horizontal no-bullet\">"
    var body = ""
    for(var i = 0; i < array.length; i++){
        body += "<li class=\"li-group_item .flex-fill " + bonus_class + "\">" + array[i] + "</li>"
    }
    return head + body + "</ul>"
}


function produce_vertical_list(array) {
    const head = "<ul class=\"list-group list-group-flush no-bullet justify-content-center align-self-start\">"
    var body = ""
    for (var i = 0; i < array.length; i++) {
        body += "<li class=\"li-group_item .flex-fill align-middle justify-content-center\">" + array[i] + "</li>"
    }
    return head + body + "</ul>"
}

function produce_card(content, title, subtitle, header, bonus_class = ""){
    var head = "<div class=\"card " + bonus_class + "\">"
    if(header != undefined){
       head += "<div class=\"card-header\">" + header + "</div>"
    }
    var body = "<div class=\"card-body\">"
    if(title){
        body += "<h5 class=\"card-title\">" + title + "<\h5>"
    }
    if (subtitle) {
        body += "<h5 class=\"card-subtitle mb-2 text-muted\">" + subtitle + "<\h5>"
    }
    body += content
    body += "</div>"
    return head + body + "</card>"
}

function setProgressBarValue(progress, pcg){
    progress.setAttribute('aria-valuenow', pcg);
    progress.setAttribute('style', 'width:' + Number(pcg) + '%');
}

function produce_table(array, caption, col_names, line_names){
    var caption = "<caption>" + caption + "</caption>"

    var head = "<thead>" + (line_names === undefined ? "" : "<tr><th scope=\"col\">#</th>")
    for (var i = 0; i < col_names.length; i++) {
        head += "<th scope=\"col\">" + col_names[i] + "</th>"
    }
    head += "</tr></thead>"

    var body = "<tbody>"
    for (var j = 0; j < array.length; j++) {
        var row = "<tr>" + (line_names === undefined ? "" : "<th scope=\"row\">" + line_names[j] + " </th>")
        var line = array[j]
        for (var i = 0; i < line.length; i++) {
            row += "<td>" + line[i] + "</td>"
        }
        row += "</tr>"
        body += row
    }
    body += "</tbody>"
    return "<table class=\"table caption-top\">" + caption + head + body + "</table>"
} 

function produce_collapse(content, id){
    return "<div class=\"collapse\" id=\"" + id + "\">" + content + "</div >"
}