{:title  "12 thing I learned evangelizing Clojure at work"
 :toc    true
 :layout :post
 :date   "2018-03-07"
 :tags   ["technology" "clojure"]}

## Background

A few days ago I stumbled on Didier's great [My observations from evangelizing Clojure at work for the last year](http://www.rubberducking.com/2018/03/my-observations-from-evangelizing.html). It's worth reading because his metaphors are graphical, down-to-earth, and beautifully accurate.

During last year I was on a similar mission and, to build on Didier's points, here's a list of 12 things I learned.


## Four things that worked and I would do again

### 1) Create a community of passionate developers

Having a group of interested, passionate developers was a big win. A core group of Clojure enthusiasts (even if it's a tiny group) helps a lot.

Make sure this group has easy ways to connect to each other. We've used a dedicated slack channel and went out on a few meetups and conferences together.

In retrospect, we would have benefited from recurring internal sessions to share experiences and concerns. Some people prefer these methods better.

### 2) Hammer down the learning nature of Clojure

Our little Clojure community quickly turned out to be very learners' oriented. Maybe Clojure is one of those languages where one is always learning. Maybe it was just us.

We openly shared questions, doubts, and potential solutions to simple problems. There was no stupid question. This attitude helped setting an atmosphere of friendliness - particularly around beginners.

Hammer down this learner-friendly mentality and make sure others in your organization see this as well. There are some practical barriers to starting Clojure and the last thing you want is the your community to be yet another one.

### 3) Cursive and Parinfer

Having [IntelliJ's Cursive](https://cursive-ide.com/) and Shaun's [Parinfer](https://shaunlebron.github.io/parinfer/) as the main setup for most developers definitely helped paving the way.

Developers used to lightweight editors such as Atom and Sublime struggled a bit at first but Cursive is a very well-designed powerhouse.

There's no hiding that parens do get on the way of beginners any Lisp dialect but Parinfer brought a bit of familiarity by nicely parsing tabulation into intended parens. For developers just using Lisp for the first time Parinfer out-shined Paredit (which in turn out-shined nothing at all).

### 4) Bake in time for learning

Our successful cases were those where we allocated enough time for learning either before or in the very early stages of the project.

A caveat though: don't let the learning process be too long and too loose. Have targets and guidelines from more experienced developers or the learning process will become a morose and fruitless phase.


## Four things that did not work (but could be done better)

### 1) Reloaded Workflow and Stuart Sierra's Components

We came across the [Reloaded workflow](http://thinkrelevance.com/blog/2013/06/04/clojure-workflow-reloaded) and [Stuart Sierra's Components](https://github.com/stuartsierra/component) once our Clojure projects were already at full speed.

In retrospective these would need to be understood and used much earlier. Reloaded is a a life-changer from the REPL perspective and we didn't really "preach the gospel" well enough to all Clojure developers.

One of the challenges in Components is its apparent object-like approach. This scared some of the more juniors developers and made some of the functional purists frown. Recently we have been enjoying [mount](https://github.com/tolitius/mount) instead of Components and adoption is going very smoothly.

### 2) Being too "free" on the IDE side

I mentioned Cursive and Parinfer above. We should have made that combo the recommended one from the very beginning. We've let developers experiment broadly. We had Emacs, Atom, VSCode and Cursive on the mix.

This was an interesting journey but we were unable to support one another more efficiently. We even had developers understandably loathing Clojure after struggling with a totally bare Atom for weeks.

We should have been able to collectively support these cases better.

### 3) The "cool kids" effect

I mentioned above the importance of keeping your internal Clojure community learners-friendly but there will still be a bit of an aura of "those brainy, know-it-all, cool kids coding on this esoteric language." It's a bit unavoidable and Didier's article points to some of the reasons behind it.

In retrospect I would have been more aware of it and tried to demystify this image more openly and publicly. The fact that Lisp-like dialects just click for you doesn't mean they do for anyone else.

### 4) Functional programming is harder than Clojure

After you get across the very thin syntax barrier of Clojure there's a much bigger one: functional programming.

All of us struggled to one extent or another with Clojure's purely functional natural in the early days. Some of us didn't get through that barrier because thinking with a functional perspective is much harder than learning Clojure itself.

In retrospect we should have trained our team in functional programming (via Clojure of course) and not Clojure alone. It would have been a smoother ride.


## Four things that did not work (and I won't do again)

### 1) Not training on the REPL strongly enough

Using a REPL does not come naturally to most of us used to the traditional code -> compile -> debug cycles. An in-line, IDE-embedded REPL is one of the most productive setups possible but it requires a different mindset. However, we have inculcated the less productive cycle onto developers for so long that they need to rediscover the REPL.

We erred by not training anyone - anyone at all!! - on the REPL alone. We assumed it would be a natural stepping stone but it wasn't. I was flabbergasted when I learned that in a project we rarely even used it.

Never assume that the REPL will be used just because it is obvious it should.

### 2) Clojure plus ClojureScript too soon

Bringing the full-stack promise of Clojure and ClojureScript to the equation is very tempting. We brought the whole shebang just too soon. Our team was barely prepared for one and we were already adding concessions to the other.

Start with Clojure or ClojureScript, make that side solid and then start wandering to the next.

Trying both at the same time adds one too many target environments, cross-compilation concerns, and completely different problem domains to the equation. The team may feel overwhelmed - justifiably so.

### 3) Om Next for an uninitiated team

Some of us fell in love with [Om Next](https://github.com/omcljs/om/wiki/Quick-Start-%28om.next%29)'s ideas: the queries close to components; the reconciler; those beautiful remotes coordinating data flow; simple optimistic updates... everything is as if straight from our wildest dreams.

It's not a simple framework though. It has its wrinkles and documentation is far from beginner-friendly. On top of that, Om Next relies on mid-to-advanced Clojure features.

We should have started with something simpler and more accessible so that developers would have a more enjoyable ride.

### 4) Pushing too many things in parallel

This was by far our biggest mistake. Clojure was an abysmal failure in situations where we were pushing too many things at once while trying to get people on track with Clojure itself.

Potential examples abound here but if your team has never worked with AWS and you are trying to get Clojure at the same time, chances are things will be tougher and Clojure might get most of the blame.

The reason is simple: it's just so much easier to find JavaScript examples that solve exactly your problem for AWS with a simple copy & paste and you'll feel completely abandoned in your endeavors with an "alien" language you haven't even grasped yet.


## Final words

Not everyone will pick up Clojure for one reason or another and that's OK. Removing as many of the barriers as possible makes the conversion easier but not absolutely certain.
