(ns infra.main
  (:require ["@pulumi/aws" :as aws]
            ["@pulumi/pulumi" :as pulumi]
            [clojure.string :as string]
            [goog :as goog]
            [infra.apigateway :as apigateway]
            [infra.cloudfront :as cloudfront]
            [infra.lambda :as lambda]
            [infra.route53 :as route53]
            [infra.s3 :as s3]))

(def exportable (atom {}))

(def two-hours (* 2 60 60))

(def an-year (* 365 24 60 60))

(defn init-config-map []
  (let [config-obj (pulumi/Config.)
        aws-config-obj (pulumi/Config. "aws")]
    {:config/path-to-website-contents (.require config-obj "path-to-website-contents")
     :config/target-domain (.require config-obj "target-domain")
     :config/certificate-arn (.require config-obj "certificate-arn")
     :config/extra-aliases (-> config-obj
                               (.get "extra-aliases")
                               (string/split #","))
     :config/cache-max-age (or (.get config-obj "cache-max-age") two-hours)
     :config/cache-s-max-age (or (.get config-obj "cache-s-max-age") an-year)
     :config/region (.require aws-config-obj "region")}))

(let [{:keys [config/target-domain
              s3/content-bucket
              s3/log-bucket
              apigateway/invoke-url
              cloudfront/static-domain-name
              cloudfront/static-distribution-id
              cloudfront/redirect-domain-name
              cloudfront/redirect-distribution-id] :as infra-map}
      (-> (init-config-map)
          s3/run
          lambda/run
          apigateway/run
          cloudfront/run
          route53/run)]

  (swap! exportable assoc

         :content-bucket-name
         (:name content-bucket)

         :content-bucket-website-endpoint
         (:website-endpoint content-bucket)

         :log-bucket-name
         (:name log-bucket)

         :apigateway-invoke-url
         invoke-url
         
         :static-cloudfront-domain
         static-domain-name

         :static-cloudfront-distribution-id
         static-distribution-id

         :redirect-cloudfront-domain
         redirect-domain-name

         :redirect-cloudfront-distribution-id
         redirect-distribution-id

         :target-url
         (str "https://" target-domain)))

(goog/exportSymbol "content-bucket-name"
                   (:content-bucket-name @exportable))
(goog/exportSymbol "content-bucket-website-endpoint"
                   (:content-bucket-website-endpoint @exportable))
(goog/exportSymbol "log-bucket-name"
                   (:log-bucket-name @exportable))
(goog/exportSymbol "apigateway-invoke-url"
                   (:apigateway-invoke-url @exportable))
(goog/exportSymbol "static-cloudfront-domain"
                   (:static-cloudfront-domain @exportable))
(goog/exportSymbol "static-cloudfront-distribution-id"
                   (:static-cloudfront-distribution-id @exportable))
(goog/exportSymbol "redirect-cloudfront-domain"
                   (:redirect-cloudfront-domain @exportable))
(goog/exportSymbol "redirect-cloudfront-distribution-id"
                   (:redirect-cloudfront-distribution-id @exportable))
(goog/exportSymbol "target-url"
                   (:target-url @exportable))
