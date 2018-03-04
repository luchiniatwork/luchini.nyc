{:title  "EJB3 Comments"
 :layout :post
 :date   "2007-06-11"
 :tags   ["technology" "java"]}

From time to time, I am one of those lucky professionals having the chance of working with state-of-the-art and break-through technologies.

In my current project, the customer has explicitly chosen to explore the well-marketed capabilities of the new EJB3.0 specification and its open-sourced implementation from JBoss.

After some really deep hands-on work with this environment, I have brought up 10 points that annoy me and that should be addressed in future releases. But before diving into that, I must confess that the EJB3.0 is a huge step forward from its predecessor. I finally have the feeling that I am designing and implementing things the way they should be (or at least it is getting pretty close).

Designing and implementing for EJB3.0 is really fun. You can easily see your business model reflected in the Entity Beans and Session Beans and you know, deep inside, that you will not need to implement and maintain a bunch of auxiliary classes to glue everything together. This is the nice part of it!

Also, the annotation-cantered style for practically everything is just wonderful: everything is where it should be AND you still have the possibility of overriding some configuration with xml descriptor files. It is a very well-balanced solution.

If you put your hands onto writing EQL and using the simple but yet very powerful constructor expression, your daily routine is greatly simplified.

Having said all these nice things, let's check the bad facts.

**1) @EJB injection not fully implemented on JBoss 4.0.5 with EJB3 RC9**

- the @EJB annotation is not fully implemented on JBoss 4.0.5 with EJB3 RC9. Application clients (servlets and JSPs included) cannot have an EJB Session Bean automatically injected on an annotated member with @EJB.
- to solve this deficiency, the design approach is to hide the JNDI lookups behind a ServiceLocator pattern.
- as of the date of this writing, it seems that JBoss 5Beta1 already implements this in a basic manner.

**2) Environment entries cannot be injected into Entity beans**

- although not specifically stated on the spec but technically possible, injecting environment entries into entity beans does not work. The xml schema definition refuses the ejb-jar descriptor when this approach is tried.
- furthermore, other injections also seem to be just ignored by the EJB container.


**3) Default Entity Listeners**

- the spec is really confusing and dubious at this point. Although the documentation points to a certain xml format with default entity listeners been possible, the official xml definition file does not even consider this directly.
- when the definition spec is properly followed, the default entity listener is just ignored.
- the solution is to define the Entity Listener on every class that needs it.

**4) @GeneratedValue only works on @Id annotated members**

- if @GeneratedValue is used on a different member than one annotated with @Id, it is completely ignored.
- GlassFish seems to throw an exception when this happens but the current JBoss implementation just ignores it.

**5) @GeneratedValue does not work in composite primary-keys**

- although nothing technical could actually deny this concept, JBoss does not implement it at all.
- there is a JIRA entry regarding this subject at http://jira.jboss.com/jira/browse/EJBTHREE-508 but the resolution state is "rejected" due to the quite arguable comment of "this is not expected to work. It doesn't really make sense to get a PK including a surrogate key and something else"

**6) Persistency cascading and multiple persistence fails if not proper surrogate key is previously given**

- the EJB container gets really lost if it does not find real surrogate keys when cascading persistence or persisting multiple entries.
- it is expected that the entities either have a previously defined surrogate key or that the generated id be known to the EJB container before-hand (before actually doing a round-trip to the database and fetching the recently given id)
- although old versions of Hibernate (the underlying JPA implementation in JBoss) allowed this round-trip to the database, newer versions (and the EJB3 approach anyway) is toward a more purist OOP perspective where the container actually "knows" the ids before actually persisting the entities.

**7) @GenericGenerator is not support in the deployment descriptors**

- @GenericGenerator is a very powerful annotation extension in JBoss. It did not enter the final EJB3.0 spec due to time constraint problems.
- although this extension works wonderfully fine when implemented as an annotation, there are no deployment descriptors available to overwrite its standard behaviour in xml.

**8) Composite keys' members cannot take part in a relationship with another entity**

- when using the @IdClass annotation with associated entities as part of the composite key, the annotations parser of the EJB3 container just ignores the fact that it represents an entity relation and loses all mapping facilities (specially when a "mappedBy" is needed).

**9) Deletion of Orphan Entities is not part of the spec**

- when a complex graph entity with associated entities has some of these entities removed, the persistence process ignores this fact and does not delete "orphaned entries" from the database.
- this is a known flaw of the spec and the current solution is to use hibernate-specific mechanisms.
- it is also possible to just remove the underlying entries as a whole and recreating them (quite an expensive solution in terms of database access).

**10) Pessimist Locking mechanisms (i.e. serialized) were just ignored in the spec**

- the spec assumes that advanced locking mechanisms should be controlled solely by the database server and concerning subsystems.
- that said, it does not provide any fine-grained access for changing the locking mechanism to pessimist scenarios.
- the .setHint() method of the query is to be used for vendor-specific implementations and might have some specific hint for changing locking mechanisms. Even so, this is not the case for JBoss.
- this is a known flaw of the spec and the current solution is to use the EJB-specific recommendation of optimistic locking (using annotation @Version on entity beans).
