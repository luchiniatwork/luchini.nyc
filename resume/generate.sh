#!/usr/bin/env bash

rm -f *.pdf
docker run --rm -v $(pwd):/src \
       luchiniatwork/beautiful-md \
       sh -c \
       "for f in *.tex; do latex -output-format=pdf \"\$f\"; done"
rm -f *.aux
rm -f *.out
rm -f *.log
