#!usr/bin/bash
links=""
for file in $(ls game_logs/*.json); do
    filename=$(basename -- "$file")
    name="${filename%.*}"
    content="var jsonData = '$(cat $file | tr -d '\n')'"
    cat web/static/model.html | head -n 14 > "web/$name.html"
    echo $content >> "web/$name.html"
    cat web/static/model.html | tail -n +16 >> "web/$name.html"
    game_name=$(echo $name | tr "_" " ")
    links="$links;<a href=\"web/$name.html\" class=\"list-group-item\">$game_name</a>"
done
cat web/static/index.html | head -n 21 > "index.html"
echo "$links" | tr ";" "\n" >> "index.html"
cat web/static/index.html | tail -n +23 >> "index.html"

