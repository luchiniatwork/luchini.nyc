#!/usr/bin/env bash

rm *.pdf
docker run --rm -v $(pwd):/src \
       luchiniatwork/beautiful-md \
       sh -c \
       "for f in *.tex; do latex -output-format=pdf \"\$f\"; done"
rm *.aux
rm *.out
rm *.log
#rm *.log
