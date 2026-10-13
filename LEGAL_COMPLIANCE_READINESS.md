# TopFit Running — legal and Stripe readiness

Updated: 13 October 2026

This checklist records what is implemented in the website and what still requires a business decision, account setting or legal review. It is not a guarantee of compliance or a substitute for advice from a qualified Dutch lawyer or privacy professional.

## Implemented in this repository

- Dutch and English privacy statement covering contact, checkout, intake/health data, newsletter, technical data, processors, international transfers, retention and data-subject rights.
- Dutch and English terms for online services, prices, delivery, payment, withdrawal, early performance, complaints, health context, liability, intellectual property and governing law.
- Cookie statement based on the current implementation: necessary Cloudflare and Stripe technology, no analytics or advertising cookies detected.
- Persistent footer links to privacy, terms, cookies and the online withdrawal function.
- Online withdrawal form with an immediate on-screen result and a durable confirmation email containing the submitted details.
- Checkout gate requiring separate acceptance of terms/privacy and an explicit request to begin during the cooling-off period.
- Server validation and Stripe metadata for terms version, early-start request and server timestamp.
- Separate explicit consent for injury/health information in the intake; version and server timestamp are recorded with the intake.

## Must be verified before Stripe goes live

- Confirm the legal identity data against the latest Chamber of Commerce extract:
  - trade name: TopFit Running
  - owner: Willem Luijckx
  - address currently shown: Mgr. Aengenentlaan 3-03, 2361 GB Warmond
  - KVK number currently shown: 42106226
- VAT identification number published: `NL005497974B44`. Confirm it against the Belastingdienst letter or Mijn Belastingdienst Zakelijk before production.
- Confirm the public phone number `+31 6 47264454` is correct and may be published.
- In Stripe, set the exact legal business name, address, support email, support phone, statement descriptor, website URL, privacy URL and terms URL.
- Configure Stripe Tax/prices so the displayed consumer total is VAT-inclusive and matches the Checkout total.
- Ensure every active offer states before payment: core characteristics, total price, delivery period, contract duration, cancellation rules and any date-specific exception to withdrawal.
- Ensure Stripe's final button unambiguously states that ordering creates a payment obligation.
- Run a test purchase and verify the confirmation email includes the product, total price, terms/withdrawal information and early-start request on a durable medium.
- Test refund and withdrawal handling, including the statutory 14-day refund deadline.

## AVG operations outside the website

- Maintain a processing register for contact, intake/coaching, payments, newsletter and website security.
- Sign/check data-processing terms with Google, Brevo and any provider acting as processor. Record Stripe's role per processing activity; Stripe may act independently for some payment/fraud purposes.
- Check international-transfer mechanisms and current subprocessor lists for Cloudflare, Google, Brevo and Stripe.
- Restrict access to the Google Sheet containing injury information, enable MFA, review sharing links and remove access promptly when no longer needed.
- Apply the published retention schedule in practice with a recurring deletion process. A privacy statement alone does not delete data.
- Document a data-breach procedure, including assessment of the 72-hour notification period.
- Create a procedure for access, correction, deletion, restriction, portability, objection and consent withdrawal requests; keep a request log.
- Review whether a DPIA is required. Health data receives extra protection; scale, systematic monitoring, vulnerable people and new technology affect the assessment.
- Do not use health/intake data for marketing, testimonials or another purpose without a separate valid basis.
- Add a working unsubscribe link to every newsletter before campaigns are sent, and maintain a suppression list.

## Consumer operations outside the website

- Keep a copy/version archive of every terms and privacy version accepted by customers.
- Define delivery times for each service and place them on the offer page before launch.
- Define rescheduling/no-show rules for Zoom sessions, physical coaching, clinics and talks and disclose them before purchase.
- For clinics or other leisure services on a fixed date, determine and disclose whether the statutory withdrawal exception applies.
- Use a complaint workflow with a target response within 14 days.
- Do not use medical claims or suggest guaranteed results; coaching remains sports guidance.
- Check professional and public-liability insurance for online coaching, physical sessions and clinics.

## Official references used

- Autoriteit Persoonsgegevens: right to information and explicit consent for special-category data.
- Autoriteit Persoonsgegevens: processor agreements, security and privacy rights.
- ACM: online-sales checklist, mandatory pre-contract information, written confirmation and cooling-off rights.
- ACM: online withdrawal function required in 2026.
- Dutch Civil Code Book 6, including the payment-obligation button and early performance during the withdrawal period.
- Belastingdienst: invoice and tax record requirements.
