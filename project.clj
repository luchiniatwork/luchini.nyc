(defproject nyc.luchini "0.1.0"
  :description "My personal website"
  :url "https://luchini.nyc"

  :dependencies [[org.clojure/clojure "1.9.0"]
                 [ring/ring-devel "1.6.3"]
                 [compojure "1.6.0"]
                 [ring-server "0.5.0"]
                 [cryogen-markdown "0.1.7"]
                 [cryogen-core "0.1.61"]]

  :plugins [[lein-ring "0.9.7"]]

  :main cryogen.core

  :ring {:init cryogen.server/init
         :handler cryogen.server/handler})
