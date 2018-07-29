#!/usr/bin/env bash

rm *.pdf
docker run --rm -v $(pwd):/src \
       luchiniatwork/beautiful-md \
       sh -c \
       "latex -output-format=pdf \"Luchini - Cover Letter.tex\" && latex -output-format=pdf \"Luchini - Resume.tex\" && latex -output-format=pdf \"Luchini - Clojure Resume.tex\""
rm *.aux
rm *.out
#rm *.log
