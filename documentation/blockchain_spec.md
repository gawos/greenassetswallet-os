# GAW Blockchain Specification

## What is green finance?

A bond is a securitised debt instrument. A lender offers debt at a certain rate of return over a certain time period. Buyers of portions of that debt can buy and sell it freely. A bond might be issued for 100000000USD with a 2% return on investment and a maturation period of 10 years. Bonds are often issued for a specific purpose (to build something, improve transport infrastructure, finance military activity, etc.), and would generally be issued by a company, bank, or a government.

"Green bonds" are a relatively recent innovation. They are bonds which are issued under the condition that the proceeds only go to "green" investments. Certain methodologies and taxonomies have sprung up around this new concept, which is described as a way to "channel private capital" towards environment-positive investments, or to "harness the market" to save the world. Given the choice between a generic bond and a "green bond", assuming a similar rate of return, it is assumed that many investors will opt for the green one. It is also assumed that this will stimulate the development of new green investment opportunities, and create a more ethical mode of investment. This is especially significant for investors which manage funds on behalf of others, for example sovereign wealth funds and pension funds, who will benefit from being able to appeal to an increasingly environmentally conscious public.

Currently the green bond market is quite small, and there is not much standardisation. In general an issuance will involve:

1. Some kind of prospectus document listing the intended use of the funds and how the environmental performance of the investments will be tracked and reported.
2. Some kind of third-party assessment of the prospectus which might focus on the credibility of the issuer, the wisdom of the proposed investments, or the scientific validity of the proposal.

Obstacles include:

1. A lack of credible issuers, especially in the developing world ("emerging markets")
2. The need to develop additional internal competences around environment science and finance in order to manage the process of issuance and subsequent reporting 
3. Additional costs for creating the prospectus and commissioning the assessment
4. Additional costs for monitoring and reporting on the environmental performance of investments

## What is the point of the Green Assets Wallet?

The GAW is intended to make it easier to issue green bonds so that the market can grow faster. It aims to:

1. Allow new issuers to provide assurances of credibility to their investors by facilitating third-party verification of investments (projects)
2. Make it easier for issuers to report on the environmental performance of investments by providing a consistent reporting platform, and ultimately supporting automated or batched reporting
3. Provide a common platform for investors and issuers to access information about issuers and projects, as well as a transparent record of past performance

## Why use blockchain for this?

It would likely be possible to achieve something like this using a conventional database. There are several reasons why it might be a good idea to use blockchain:

1. Agreeing upon and enforcing standards is challenging, especially across the entire world. A blockchain enforces some kind of standard programmatically, and by necessity. This can be positive in the context of green finance where investments are often made across national borders, and where it is both desirable and challenging to ensure that different actors in different locations would otherwise adhere to standards consistently. 
2. This produces higher quality data, and ultimately to a rich resource for research into the quality and impact of different kinds of "green" activity in different contexts. It is often quite controversial or ambiguous whether something is green or not, or how "green" it really is. High quality data can help to clarify this. A good system of governance means that these standards can arise organically from the collective action of a consortium of stakeholders, as opposed to being imposed by some organisation. This could theoretically be achieved with a centralised platform, but there is little precedent for it.
3. Physically distributing infrastructure across stakeholders can result in a better distribution of costs. The burden of supporting the system is borne by those who gain the most from it. Increasing the scale can actually reduce the cost for individual members of the consortium.
4. Better transparency, natural incentives to be as transparent as possible.
5. Better ecosystem support. A more liberal model for third parties to create services based on GAW data. Potential additionalities.

## How is blockchain used?

Blockchain is used as a store of facts. There is a simple hierarchy of roles and entities which codifies and reflects the realities of green finance. The key features are:

1. Secure and transparent replication of data
2. Enforcement of standards about data validity 
3. Pervasive digital signatures

"Responsibility", meaning accountability for the quality/accuracy/honesty of the information submitted to the blockchain is devolved (as much as possible) to the issuer user. In reality, they are responsible for handling the money they raise responsibly. It makes sense that they should have a high degree of autonomy. An issuer can input dishonest data, but it will remain there for others to discover which serves as a strong disincentive. Like other blockchains, the GAW aims to make it more rewarding to behave in a good way than in a bad way.

## Terms and ambiguity

The world of finance is quite relationship oriented and unstructured. It relies on a sometimes arcane shared understanding about obscure terms, the difference between which is sometimes unclear to the outsider. For example, there has been much discussion about whether this platform might be extended to encompass i) "social bonds", ii) "sustainability bonds", and iii) "green loans". From the perspective of the GAW, these things are basically identical. They involve a set of obligations, and information about how those obligations are fulfilled in the form of real-world investments. Essentially, there is a lack of distinction between form and content. Just as it is not necessary to know that much about musical genres to design the compact disc, so the GAW aims to abstract away from specific terms where possible to achieve the best general utility. Commitments/Green commitments/Elegibility Criteria/Intended Use of Proceeds; these can all be represented as a list of short paragraphs which contain distinct "promises", it doesn't matter that much what they are called.

## Roles/objects/actions

### Admin

The admin role can: 

* Create new issuer and validator accounts.
* Generate keypairs for issuer and validator accounts
* Associate keys with issuer and validator accounts
* Mark keys as active or inactive
* Mark accounts as active or inactive
* Update credentials for accounts

#### Current workflow:

1. Issuer/validator requests account using side channel (email) 
2. Admin creates new admin/issuer account, keypair is auto generated 
3. Admin communicates credentials to issuer/validator 
4. Issuer/validator completes profile

#### Proposed workflow:

1. Issuer/validator requests account using side channel (email) 
2. Issuer/validator communicates public key to admin 
3. Admin creates new admin/issuer account and adds pubkey to that account 
4. Admin communicates credentials to issuer/validator 
5. Issuer/validator completes profile and updates password

#### Signing process:

Keys are stored on server, the server signs on behalf of the account. Ideally both client-side and server-side signing should be supported, with an indication of which is in use. 

### Issuer

The issuer role can:

* Create/edit a "green bond profile" consisting of:
	* Issuer name
	* Issuer description
	* "Green objectives"
	* Website
	* Logo/image
* Create/edit/'delete' a "framework" consisting of:
	* Framework name
	* Framework description
	* "Commitments" 
	* Files
	* "Sustainable development goals" (selected from list, see apps/issuer/src/constants.js)
	* "Use of proceeds categories" (selected from list, see apps/issuer/src/constants.js)
* Create/edit/'delete' "pools" consisting of:
	* Pool name
* Add/remove projects and bonds to/from a pool
* Create/edit/'delete' "bonds" consisting of:
	* ISIN/Bond ID
	* "Issue volume" (how much money was/will be raised)
	* Currency (selected from list)
	* Issue date (when the bond was issued in the real world)
	* Maturity date (when the bond will "mature", ie. when holders of bonds will get their money back)
* Create/edit/'delete' "projects" consisting of:
	* Project name
	* Project description
	* Files
	* Amount allocated (how much money was/will be spent on it)
	* Currency
	* Region
* Create/edit/'delete' "impact reports" consisting of:
	* Report description
	* Report files
	* An "indicator" which implies a number of fields depending on which indicator is selected. Indicators are:
		* Energy generation (value, unit)
		* Energy consumption (value electricity, value heating, value cooling, unit)
		* Emission avoidance (value, unit, "methodology & assumptions")
* Create/edit/'delete' "validation reports" consisting of:
	* Report name
	* Report description
	* "Validator" (selected from list of active validator accounts)
	* A "report specification", which is a custom form created using a form builder. The form can include text entry fields, file upload fields. Fields can be named.

Objects are "marked as deleted" rather than being actually deleted from the database. If a parent obect is marked as deleted, all child objects are assumed to be marked as deleted. 

#### Current workflow

1. Issuer creates framework
2. Issuer creates bonds/projects
3. If desired, issuer creates new pool(s) and links bonds/projects by adding them to the same pool
4. Issuer creates validation reports
5. Issuer creates impact reports

There is no strict order to these actions, but child objects cannot be created without a parent. That is, no bonds/projects without a framework, and no reports without a project. 

### Valídator

The validator role can:

* Create/edit a "validator profile" consisting of:
	* Validator name
	* Validator description
	* "Green objectives"
	* Website
	* Logo/image
* "Validate" validation reports by completing the form specified in the "report specification" by the issuer

### Order of relationships

Issuer 1-1 Framework 
Framework 1-* Bonds
Framework 1-* Projects
Pool 1-* Projects
Pool 1-* Bonds
Project 1-* Impact reports
Project 1-* Validation reports
Validator 1-* Validation reports