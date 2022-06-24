{:title  "Testing the data layer of applications"
 :layout :post
 :toc    true
 :draft? true
 :date   "2018-03-10"
 :tags   ["technology" "clojure"]}

Integrating service providers into consumers is a messy business that's often overlooked. Coupling issues abound. Establishing and maintaining contracts alone can be a great deal of stress: who owns the contract? The provider or the consumer? What happens when contracts need to change? How do we manage breakage? Etc.

This article shows a particular stack - chosen for its very attributes - and an accompaining workflow that together tackle some of these challenges.


## The scenario

Let's consider a very common scenario. An app team is ready to kick off building this amazing new app. The service team is ready to kick off this amazing new API that will be used by the app.

The work ahead of the service team is not trivial at all. There are lots of systems to be integrated with, data to be fetched from multiple sources, race conditions to be sorted, and performance challenges to be tackled.

The work ahead of the app team is equally dauting. There are platform limitations to be sorted, screen sizes to be tackled, async and uptade strategies to be implemented, and a potentially very complex state machine for the UI.

Meanwhile, both app team and service team need to agree on the contract of the API. That tiny little piece of bureocracy that keeps the two sides glued together.

Defining, agreeing, and evolving this contract is work. Very often the app team and the service team are not even in the same country. More often than not they are even from different companies. Still, they need to come to terms with that one touch point or everything falls apart.


## Where is the value, really?

Before diving any further, there's something to consider: where is the value in the relationship between the app and the service layer?

There is a tendency to see value as delivered from the service tier to the consumer (the app in our case). It is a valid point of view because there's an intrinsic value in integrating and transforming data to be consumed by other components.

However, there are some great ideas in the [Consumer-Driven Contract pattern](https://www.martinfowler.com/articles/consumerDrivenContracts.html) that would suggest otherwise. The proposed pardigm here is that the consumer defines the value of the contract - and not the other way around.

In practice, the value of a service is always in proportion to it been consumed. A service provider sitting idly somewhere, not being used by anyone, does not have any value at all.


## The contract

Any interface between systems is a contract. Some people avoid the word _contract_ in this kind of scenario. They prefer using _API_ instead, which is understandable. A _contract_ is such a serious business! This is the very reason why I personally like using it. A established interface is serious business!

Despite being serious business, we often don't dedicate the energy to consider this touch point seriously. One way to prove it is when we stumble with a REST endpoint like this:

    http://domain.com/api/v1/employees

Before moving forward, consider this endpoint for a second and answer to yourself: what do you expect to get as a response? A list of employees, maybe? Probably. In which format? JSON? Maybe. Why not TOML, XML, or anything else? Let's say JSON. But then, how are the employees organized? How the data is structured?

Here's where documentation comes in. Hopefuly there will be a Swagger, API Blueprint, RAML, or similar spec somewhere being used to describe the format and shape of the data.

More often than we would like to confess, there's no documentation at all or the documentation is out of sync with the implementation.

If the documentation is to be a contract but it's not up-to-date or is non-existant, what are we supposed to code against then? We need stronger 

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
