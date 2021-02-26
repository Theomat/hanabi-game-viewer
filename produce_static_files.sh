#!usr/bin/bash
for file in $(ls game_logs/*.json); do
    filename=$(basename -- "$file")
    name="${filename%.*}"
    content="var jsonData = '$(cat $file | tr -d '\n')'"
    cat web/static/model.html | head -n 14 > "web/$name.html"
    echo $content >> "web/$name.html"
    cat web/static/model.html | tail -n +16 >> "web/$name.html"
done
