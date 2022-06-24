[circleci-badge]: https://circleci.com/gh/luchiniatwork/luchiniatwork.github.io.svg?style=svg&circle-token=ec8c4f1ce493b98c35ff9a37cf39cd3d1d65055f
[circleci]: https://circleci.com/gh/luchiniatwork/luchiniatwork.github.io

# luchini.nyc

[![CircleCI][circleci-badge]][circleci]

Personal website at [luchini.nyc](https://luchini.nyc).

## Dependencies

* Java
* Clojure

## Dev Mode

    $ clojure -X:serve

## Static Generation

    $ clojure -M:build

## Static Location

    public/

## Automatic Deploy (Netlify)

Rebase and push onto branch `release`.
