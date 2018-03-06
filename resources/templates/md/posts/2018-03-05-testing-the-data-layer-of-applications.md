{:title  "Testing the data layer of applications"
 :layout :post
 :toc    true
 :draft? true
 :date   "2018-03-10"
 :tags   ["technology" "clojure"]}

Integrating service providers into consumers is a messy business that's often overlooked. Coupling issues abound. Establishing and maintaining contracts alone can be a great deal of stress: who owns the contract? The provider or the consumer? And what happens when contracts need to change? How do we manage breakage? Etc.

There are great ideas in the [Consumer-Driven Contract pattern](https://www.martinfowler.com/articles/consumerDrivenContracts.html). I particularly appreciate the shift in paradigm where the consumer becomes more central in the value of the contract itself. The value of a service is always in its consuming side. A service provider sitting idly somewhere on the cloud not being used by anyone does not have any value.

## The scenario

This is a very common scenario. An app team is ready to kick off building this amazing new app. The service team is ready to kick off this amazing new API that will be used by the app.

The work ahead of the service team is not trivial at all. There are lots of systems to be integrated with, data to be fetched from multiple sources, race conditions to be sorted, and performance challenges to be tackled.

The work ahead of the app team is equally dauting. There are platform limitations to be sorted, screen sizes to be tackled, async and uptade strategies to be implemented, and a potentially very complex state machine for the UI.

Meanwhile, both app team and service team need to agree on the contract of the API. That tiny little piece of bureocracy that keeps the two sides glued together.

Defining, agreeing, and evolving this contract is work. Very often the app team and the service team are not even in the same country. More often than not they are even from different companies. Still, they need to come to terms with that one touch point or everything falls apart.


## The contract

Any interface between systems is a contract. I know most people avoid the word _contract_ in this scenario. They prefer using _API_, which is understandable. A _contract_ is such a serious business. This is the very reason why I like using it. If you sign a contract, you better not break it or ther might be consequences.



TBD: talk about graphql and all

## Consumer is king

TBD: remmeber CDD? yeah, we drive it

## Specing the data

TBD: clojure.spec

## How do we know the spec is followed?

TBD: some discussion on mismatches - i.e. nullable/queriable, etc

## A proxing strategy

TBD: the proxy in-between

## Reporting inconsistencies up

TBD: to the testers/users
