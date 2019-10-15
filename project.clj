(defproject nyc.luchini "0.1.0"
  :description "My personal website"
  :url "https://luchini.nyc"

  :dependencies [[org.clojure/clojure "1.10.1"]
                 [ring/ring-devel "1.7.1"]
                 [compojure "1.6.1"]
                 [ring-server "0.5.0"]
                 [cryogen-markdown "0.1.11"]
                 [cryogen-core "0.1.66"]]

  :plugins [[lein-ring "0.12.5"]]

  :main cryogen.core

  :ring {:init cryogen.server/init
         :handler cryogen.server/handler})
