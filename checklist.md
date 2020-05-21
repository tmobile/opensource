# Open Source Security Checklist

## Overview
This checklist is meant to provide a list of commonplace mistakes that developers and reviewers
miss when releasing new open source code. This checklist is not exhaustive, and it is not meant
to be.

Security considerations will vary per application. For example, apps with form fields for user
input will require more security considerations than those without. OWASP and SANS both maintain
[checklists](https://software-security.sans.org/resources/swat) and
[review guidelines](https://owasp.org/www-pdf-archive/OWASP_Code_Review_Guide_v2.pdf) that
cover the entirety of application scopes and functions. OWASP also maintains an extensive set
of [AppSec Cheat Sheets](https://cheatsheetseries.owasp.org) that provide a concise collection
of high value information on specific vulnerabilities. Pull information from these sources as
necessary based on your application scope and needs. __Use your best judgement.__

## Checklist

### Configuration
_These checks only apply to new repositories._
 - [ ] __All Maintainers Must Use Multi-Factor Auth__
    - All project maintainers must configure
      [multi-factor auth](https://help.github.com/en/github/authenticating-to-github/configuring-two-factor-authentication)
      to minimize the risk of their accounts being compromised.
 - [ ] __All Maintainers Should Sign Commits__
    - All project maintainers should configure [commit
      signing](https://help.github.com/en/github/administering-a-repository/enabling-required-commit-signing)
      so that they can verify code changes are genuine and have not been tampered with.
 - [ ] __Trunk Is Locked To The Public__
    - All changes should be proposed in the form of a
      [Pull Request/Merge Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests).
      For example, most of our repositories use a _master_ (current version)
      and _develop_ (next version) branch strategy.
      Only [owners and maintainers](https://help.github.com/en/github/administering-a-repository/configuring-protected-branches)
      should be able to push to _master_.
 - [ ] __Automate Merge Request/Pull Request Validation__
    - Using [continuous integration (CI)](https://help.github.com/en/actions/building-and-testing-code-with-continuous-integration/setting-up-continuous-integration-using-github-actions)
      helps to ensure that changes are made in a consistent, repeatable manner in all environments.
      All repositories should have this set up.
 - [ ] __Perform Code Reviews__
    - At least one maintainer __other than the developer__ (preferrably two) must
      [review and approve MRs/PRs before merging](https://help.github.com/en/github/administering-a-repository/enabling-required-reviews-for-pull-requests).
      Code reviews can be one of the most effective ways to find security bugs. Regularly review
      your code looking for common issues like SQL Injection (SQLi) and Cross-Site Scripting (XSS).

### User Generated Input
 - [ ] __All External Input, No Matter What It Is, Must Be Examined And Validated__
    - Always validate user input by testing type, length, format, and range. Never
      concatenate user input that is not validated. String concatenation is the primary point
      of entry for script and SQL query injection (SQLi).
 - [ ] __Use Multiple Layers Of Validataion__
    - Never assume that client-side validation has been performed on incoming data.
      Ensure that data validation occurs on the server side, before any value is used, and,
      that there are no backdoors to avoid it.
 - [ ] __Review Parroted User Input Data for Cross-Site Scripting (XSS) Vulnerabilities__
    - All output functions must contextually encode data before sending it to the user.
      Depending on where the output will end up in the HTML page, the output must be encoded
      differently. Do not assume data coming from the server is safe. Please see the
      [OWASP XSS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)
      for more details and examples.

### Out-of-Band Communication
_The term ‘out-of-band’ is used when an application communicates with an end user over a
channel separate to HTTP request/responses. Common examples include text/SMS,
phone calls, e-mail, and regular mail._
 - [ ] __Rate Limit The Interface__
    - Consider using a CAPTCHA, or two-factor-authentication, for out-of-band communication
      features. It should not be possible for an attacker to flood someone with SMS messages, or to
      blast e-mails to random people.
 - [ ] __Use Known Destinations__
    - Do not allow the out-of-band feature to accept destinations from the user. Only use registered
      phone numbers, verified e-mails, whitelisted service URLs, etc.

### Session and Cache Management
 - [ ] __Session Tokens Should Be Fragile__
    - Session tokens should be regenerated when the user authenticates to the application,
      when the user privilege level changes (up or down), when the user is idle for a set period
      of time (e.g. 10-15 minutes), when an extensive amount of time (e.g. 4-8 hours) has passed
      since they logged in, and when any sign of session tampering has been detected. Ensure any
      corresponding data on the server is destroyed, so that the session cannot be accidentally
      revived. This helps mitigate the risk of an attacker using a hijacked session.

### Direct Object References
_These vulnerabilities arise when applications expose internal objects to the user.
For example, hacking the `acct_id` value in a query string should not allow the user
to view details of accounts they should not see._
 - [ ] __Validate Access Rights On All Input__
    - Understand where user input is used to access a database row, a file, application page,
      etc. Ensure proper validation is in place to prevent retrieval of objects the user is
      not authorized to view. This validation must occur on the server side, as client side
      code can be bypassed by the attacker.
 - [ ] __No Indescriminate Object Binding__
    - Use a model which does not have values the user should not edit, or, use a bind method
      with whitelisted editable attributes. The application must accept only desired inputs
      from the user and any remaining values must be rejected or left unbound.

### Error Messages
 - [ ] __Display Generic Error Messages__
    - Error messages should not reveal details about the internal state of the application.
      For example, file system path and stack information should not be exposed to the user
      through error messages. Error messages which reveal that the userid is valid but that
      the corresponding password is incorrect confirms to an attacker that the account _does_
      exist on the system.
 - [ ] __No Unhandled Exceptions__
    - Given the languages and frameworks in use for web application development, never allow
      an unhandled exception to occur. Error handlers should be configured to handle
      unexpected errors and gracefully return controlled output to the user.
 - [ ] __Suppress Framework Generated Errors__
    - Your development framework or platform may generate default error messages.
      These should be suppressed or replaced with customized error messages as framework
      generated messages may reveal sensitive information to the user.
 - [ ] __Do Not Log Inappropriate Data__
    - While logging errors and auditing access is important, sensitive data should never
      be logged in an unencrypted form. For example, under HIPAA and PCI, it would be a
      violation to log sensitive data into the log itself, unless the log is encrypted on
      the disk. Additionally, it can create a serious exposure point should the web
      application itself become compromised.

### Sensitive Data and Personally Identifying Information
 - [ ] __Do Not Put Sensitive Data In A URL__
    - TLS will protect the contents of the traffic on the wire, including the URL.
      However, remember that URL’s are visible in browser history settings, and are also
      written in server logs.
 - [ ] __Use Current Best Practice Cryptographic Hashing__
    - All sensitive data should be stored as a hashed value, generated using a unique-per-user
      salt value of at least 128 bits (16 chars). Remember to also store the salt value.
      [OWASP maintains a great list of secure hashing algorithms, use one of the ones recommended
      there if possible](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#password-hashing-algorithms).
      If using SHA, use SHA-512 and above. Older and weaker algorithms are insufficient.
      MD5 and SHA-1 are easily-reversible hashes and should always be avoided for cryptographic use.
 - [ ] __Do Not Store Internal Corporate Details In Test Data, Code Comments, or Config Files__
    - Remove all server names, URLs, environment names, API details, usernames, email addresses, etc.
      If the information is specific to T-Mobile, or could be used by attackers to understand more
      about our internal systems, it should not be in an opensource codebase.

### HTTP-Specific Concerns
 - [ ] __Use Challenge Tokens To Prevent Cross Site Request Forgery (CSRF)__
    - Challenge tokens are random value tokens that are unique per session and HTTP request.
      The application should issue new challenge tokens with every HTTP response, and expect
      to receive tokens with every HTTP request. If the token is not present, or is invalid,
      immediately terminate the user session.
 - [ ] __Limit Use Of Cross Origin Resoure Sharing (CORS)__
    - Use the `Access-Control-Allow-Origin` header only on chosen URLs that need to be accessed
      cross-domain. Don’t use the header for the whole domain. Allow only whitelisted domains.
      Remember that not all browsers will perform a pre-flight `OPTIONS` request, so ordinary
      `GET` and `POST` requests should also validate access.



