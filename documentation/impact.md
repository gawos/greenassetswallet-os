# Impact reporting discussion and overview

*Impact* is the measure of value delivered in environmental terms by an entity or undertaken over a defined length of time.
It encompasses values that can be quantitatively measured and which are more abstract or subjective.

### GAW impact

The green assets wallet facilitates the communication of impact metrics between issuer and investor. It does this by:

* Storing data about impact transparently and with strong guarantees of integrity
* Providing a means for issuers to input impact metrics for projects in a machine readable format
* Allowing impact metrics to be recorded in a way which is consistent across projects, issuers, and time.
* Aggregating and presenting relevant impact data to investors

### Scope

There are many ways to measure and express impact.
This means that creating a generalised model for recording it in a way that supports the above objectives is very challenging.
For this reason, the scope of the impact data model has been intentionally limited for the first phase of the GAW project.

### Project categories and impact report types

The impact reporting model includes three types of impact report.
The types of impact report correspond to commonly used *indicators*.

All impact reports include the following data:

1. Project ID
2. Indicator
3. Description

The three report types correspond to the selected indicator and consist of the following data:

1. Energy generation
    1. Energy generated in kWh
    2. Year
    3. Document
2. Energy performance
    1. Energy consumed in kWh
    2. Internal floor area in m2
    3. Year
    4. Document
3. Emissions avoidance
    1. Emissions avoided in tonnes/CO2e
    2. Description of methodology, including assumed baseline
    3. Year
    4. Document

Two classes of project have been selected for the initial impact model.

1. Solar power
    1. Energy generation
    2. Emissions avoidance
2. Green buildings
    1. Energy performance
    2. Emissions avoidance

### Reporting process

1. Impact reports are created only by *issuers*
2. The issuer navigates to a project page, clicks "new impact report"
3. The issuer selects the desired indicator from a drop-down menu and is shown a form with the appropriate fields for that indicator
4. The issuer provides the required information, plus any additional information
5. The issuer clicks "commit impact report"

### Calculations

The GAW aims to store impact data in the least processed form possible so that it can be as durable and useful as possible.
This means that in order to present relevant data to the investor, a small number of calculations need to be performed.
The number and complexity of these calculations has been kept to a strict minimum.

It should be possible in any view which includes multiple reports to display the sum of values from all reports of the same type.
These views are:

* Project view can have multiple impact reports of different kinds
* Framework view has multiple projects with multiple reports of different kinds
* Issuer view has multiple frameworks with multiple projects with multiple reports of different kinds
* Portfolio view has multiple projects with multiple reports of different kinds

### Portfolio view and pools

Projects *have* impact. Investors *have* impact indirectly because they own bonds, which fund projects.
Bonds and projects are related to one another by a common *framework*, but this is a very crude association.
There needs to be a more flexible and granular way of mapping between bonds and projects.

1. Ensuring that bonds and projects exist in one and only one pool
2. Child data to projects (reports) are independent of the pool (pool can be changed without borking the reports)
3. Bonds and projects can be moved relatively simply between pools

Secondary to the data model there is a usability question. Some issuers have a concept of pools, some do not.
"Pooling" in some sense is common, as they do not track investments dollar for dollar using dedicated accounts.
We need to provide for a range of different levels of granularity without burdening the issuer too much up front.

To overcome this, each issuer has one automatically generated pool by default.
All new bonds and projects created by that issuer are automatically assigned to that pool.
The issuer can reorder projects and bonds and create arrangements of pools if/as they like.
This means they are not blinded by complexity, but they can respond to demand for better impact data if they choose.
The actual "pool" can be completely invisible to the issuer unless they choose to engage with it.

Reasons for bothering with this at all:

1. Investors want easily aggregated and accurate impact data.
To relate impact to money invested we need to understand how bonds relate to projects.
Even if many issuers don't do this now, if it was easier they would, and in the future they likely will.
We can influence that in a positive direction which is one of the main goals of the project.
2. Even if the majority of bonds issued by an issuer are pooled, there is the occasional "project bond". The purchaser of a project bond will want to know about that project specifically.
3. Frameworks will be versioned. There will be multiple historical frameworks with projects and bonds associated with them. Even if new projects default to the latest framework version, it must be possible to collect impact data across historic frameworks provided they are sufficiently similar. Pools provide issuers with the ability to comprehend and influence this in the way they see fit.

**Portfolio impact**

It must be possible to aggregate impact across a portfolio, be that all the bonds and projects for an issuer, a framework, a pool, or an investors portfolio. In the latter case, it must also be possible to calculate the proportion of impact that the investor is responsible. This proportion is a proportion of the total impact of all project pools equal to the proportion of the investors holding of the total value of all bond pools.
An investor owns shares of certain bonds (*b*). Bonds have pool_ids (*i*), projects also have pool_ids (*i*).

A *view* is a totality of bonds and projects which share a pool_id with a set of bonds.

To calculate impact (simplistically), we need three numbers:

*H* = Total holding, that is the sum of all the money the investor has invested in all bonds in the view

*R* = Total raised, that is the sum of all the bonds in the view.

*I* = Total impact, that is the sum of all impact (for a given unit type) for all projects in the view.

Impact for that view can then be expressed as *(H/R)I*

**Issues**

*Mixed funding sources*: Some projects are funded by both “green” and “brown” investments.
