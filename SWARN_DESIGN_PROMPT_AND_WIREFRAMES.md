# Swarn — Claude design prompt and app wireframes

## Prompt

Design Swarn, a community emergency-response service connecting people requesting help with nearby verified responders while supporting coordination with professional emergency services. Create high-fidelity designs from these line wireframes. Preserve hierarchy, screen connections, and distinctions between confirmed and unconfirmed information. These are proposed UX requirements to validate, not evidence of an operational service.

### Interfaces

1. Public mobile app.
2. Verified responder mode in the mobile app.
3. Coordinator desktop dashboard.

### Design rules

- Calm, clear, accessible, usable under stress; one obvious primary action per screen.
- Large touch targets, plain language, readable text, screen-reader support, text scaling, reduced motion, and local languages.
- Never communicate status through colour alone.
- Emergency access without registration; no mandatory medical profile.
- Do not ask witnesses to diagnose conditions.
- Use labelled placeholders for professionally approved medical guidance. Do not invent treatment instructions.
- Opening a phone call does not confirm ambulance dispatch.
- Distinguish community responders from professional emergency services.
- Show Sent, Accepted, and Arrived only when confirmed by the corresponding event.
- No guaranteed arrival times, survival claims, unsupported hospital availability, or invented operational metrics.
- Clearly identify fictional sample data as prototype content.
- Avoid excessive animation, gamification, decorative medical imagery, and celebratory completion screens.
- Do not add AI diagnosis, automated treatment advice, live hospital capacity, or ambulance tracking without supported service integrations.

Public navigation: `Home | Learn | Activity | Profile`

Responder navigation: `Availability | Requests | Activity | Profile`

Hide regular bottom navigation during an active emergency. Keep the active incident easy to return to.

## Screen connections

```text
FIRST USE
Language -> Introduction -> Public home
                         -> Optional sign-in

REQUEST HELP
Home -> Location + minimal details -> Request status
                                      |-> Assigned -> Arrived -> Closure -> Feedback
                                      |-> No responder available
                                      |-> Request failed

Emergency calling remains accessible throughout and does not depend
on completing the community-responder request.

PREPARE
Learn -> Training detail -> Registration
      -> Practice mode

PROFILE
Profile -> Emergency information / Trusted contacts
        -> Language and accessibility / Privacy and permissions

RESPONDER
Apply -> Pending verification -> Approved -> Availability
      -> Invitation -> Decline
                    -> Accept -> Assigned incident -> Arrived
                              -> Handover -> Close participation

COORDINATOR
Overview -> Incident detail / Verification / Coverage / Review
```

## Public mobile screens

### U01 — Language selection

```text
+--------------------------------------+
| SWARN                                |
| Choose your language                 |
| (*) English                          |
| ( ) Hindi                            |
| ( ) Other supported language         |
|                                      |
| [ Continue ]                         |
| [ Emergency help ]                   |
+--------------------------------------+
```

Emergency help bypasses onboarding. Languages match the pilot community.

### U02 — Introduction

```text
+--------------------------------------+
| SWARN                          Skip  |
| Help your community respond          |
| Request nearby trained support and   |
| connect with emergency services.     |
|                                      |
| - Request help                       |
| - Follow response updates            |
| - Prepare before emergencies         |
|                                      |
| [ Continue without account ]         |
| [ Sign in / Create account ]         |
|                                      |
| Professional emergency services      |
| remain a separate response.          |
+--------------------------------------+
```

One introduction screen, not a long carousel.

### U03 — Optional sign-in

```text
+--------------------------------------+
| < Sign in                            |
| Save your training and profile.      |
| Phone number                         |
| [ Country code | Number            ] |
| [ Send verification code ]           |
|                                      |
| [ Continue without account ]         |
| Privacy notice                       |
+--------------------------------------+
```

Companion verification screen: code entry, resend, incorrect code, change number. Sign-in never blocks emergency access.

### U04 — Public home

```text
+--------------------------------------+
| SWARN                      Language  |
| Community: [Pilot area]              |
|                                      |
| Need emergency help?                 |
| [ CALL EMERGENCY SERVICES ]           |
| [ REQUEST NEARBY RESPONDER ]          |
|                                      |
| Nearby responders provide            |
| community assistance.                |
|                                      |
| Prepare before an emergency          |
| [ Find training                   >] |
| [ Try a practice scenario         >] |
|                                      |
| Home   Learn   Activity   Profile     |
+--------------------------------------+
```

When an incident is active, replace preparedness content with a prominent Return to active request card.

### U05 — Location and minimal details

```text
+--------------------------------------+
| < Request nearby help                |
| [ Call emergency services ]          |
|                                      |
| Where is help needed?                |
| [ Map with editable scene pin ]      |
| [ Detected address                 ] |
| [ Change / enter manually ]          |
| Entrance, floor or landmark          |
| [ Optional                         ] |
|                                      |
| Who needs help?                      |
| ( ) Me    ( ) Someone else           |
| What happened?                       |
| [ Brief description                ] |
| [ I'm not sure ]                     |
| Contact for this incident            |
| [ Callback number                  ] |
|                                      |
| Location and incident details are    |
| shared with assigned responders      |
| and coordinators.                    |
| [ SEND REQUEST ]                     |
+--------------------------------------+
```

Progressively disclose optional fields. No long symptom questionnaire or registration requirement.

### U06 — Searching for a responder

```text
+--------------------------------------+
| Active request                       |
| Community request sent               |
| Looking for an available responder   |
| No responder has accepted yet.       |
|                                      |
| Scene: [Address]              [Edit] |
|                                      |
| PROFESSIONAL EMERGENCY SERVICES       |
| Dispatch status not confirmed        |
| [ Call emergency services ]          |
|                                      |
| [ Support while waiting ]            |
| [ Add access information ]           |
| [ Cancel community request ]         |
+--------------------------------------+
```

No fake countdown, progress percentage, or guarantee of help.

### U07 — Responder assigned

```text
+--------------------------------------+
| Active request                       |
| A responder has accepted             |
| [Photo] [Responder name]              |
| Verified community responder         |
| Qualification: [Verified role]        |
| Status: Travelling to scene           |
| Updated: [Time]                      |
|                                      |
| [ Map / approximate progress ]       |
| [ Contact responder ]                |
| [ Add entrance details ]             |
| [ Support while waiting ]            |
| [ Call emergency services ]          |
| Request details                   >  |
+--------------------------------------+
```

Arrival estimates require a dependable source; label as estimates and show update time.

### U08 — Support while waiting

```text
+--------------------------------------+
| < Active request                     |
| Support while waiting                |
| [ Connect to emergency service ]     |
|                                      |
| +----------------------------------+ |
| | Professionally approved support  | |
| | content placeholder              | |
| | One clear item at a time         | |
| +----------------------------------+ |
| [ Read aloud ] [ Text display ]      |
| Responder: [Current status]          |
| [ Return to request ]                |
+--------------------------------------+
```

No invented CPR, medication, diagnosis, or treatment instructions. Requires clinical content and workflow review.

### U09 — Contact and access details

```text
+--------------------------------------+
| < Contact responder                  |
| [Name / verified role]               |
| [ Call responder ]                   |
|                                      |
| Quick access information             |
| [ Entrance / gate                  ] |
| [ Floor / room                     ] |
| [ Landmark                         ] |
| [ SEND UPDATE ]                      |
| Delivery: Confirmed/Pending/Failed    |
| [ Call emergency services ]          |
+--------------------------------------+
```

Use focused coordination rather than a complex chat interface initially.

### U10 — Responder arrived

```text
+--------------------------------------+
| Active request                       |
| Responder marked Arrived             |
| [Name] - [Verified role]              |
| [ View responder identification ]    |
| [ I cannot find the responder ]      |
|                                      |
| Location: [Address]                  |
| Reported at: [Time]                  |
| [ Add relevant information ]         |
| [ Call emergency services ]          |
| Professional handover                |
| Not yet recorded                     |
+--------------------------------------+
```

Community responder arrival does not imply professional arrival.

### U11 — Community response closed

```text
+--------------------------------------+
| Response update                      |
| Community response closed            |
| Reason: [Recorded reason]            |
| Recorded by: [Role]                  |
| Time: [Time]                         |
|                                      |
| This describes community response,   |
| not the patient's medical outcome.   |
|                                      |
| [ View incident summary ]            |
| [ Give feedback later ]              |
| [ Return home ]                      |
+--------------------------------------+
```

No celebratory messaging or unsupported claims about outcomes.

### U12 — Feedback

```text
+--------------------------------------+
| < Feedback                     Skip  |
| Was it clear what to do next?        |
| [ Yes ] [ Partly ] [ No ]             |
|                                      |
| Did you encounter a problem?         |
| [ Communication ] [ Location ]       |
| [ Response updates ] [ Other ]       |
| [ Optional comments                ] |
| [ Submit feedback ]                  |
| [ Report a service concern ]         |
+--------------------------------------+
```

Feedback is optional and can be completed later.

## Preparedness and profile

### U13 — Learn

```text
+--------------------------------------+
| Learn                                |
| Prepare with your community          |
| [ Local training sessions         >] |
| [ Practice using Swarn            >] |
| [ Responder programme             >] |
|                                      |
| My training                          |
| [ Upcoming session / Empty state ]   |
| Home   Learn   Activity   Profile     |
+--------------------------------------+
```

### U14 — Training detail

```text
+--------------------------------------+
| < Training session                   |
| [Session title]                      |
| Provider: [Verified organization]    |
| Date/time: [Details]                 |
| Location: [Venue]                    |
| Language: [Language]                 |
| Cost: [Amount / Free]                |
| Accessibility: [Details]             |
| What the session covers              |
| [Short description]                  |
| [ REGISTER ]                         |
+--------------------------------------+
```

Include registration confirmation, full session, cancellation, and no-local-session states.

### U15 — Practice mode

```text
+--------------------------------------+
| PRACTICE - NO REAL ALERTS             |
| Try requesting help                  |
| Explore a fictional situation.       |
| No responder will be contacted.      |
| [ Start practice ]                   |
| [ Exit practice ]                    |
+--------------------------------------+
```

Reuse request screens with a persistent practice label. Never initiate real calls or alerts in practice mode.

### U16 — Activity

```text
+--------------------------------------+
| Activity                             |
| [ Active request, if present ]       |
| Previous community requests          |
| +----------------------------------+ |
| | [Date] - [Closure status]         | |
| | View summary                   > | |
| +----------------------------------+ |
| Home   Learn   Activity   Profile     |
+--------------------------------------+
```

Limit sensitive information and include an empty state.

### U17 — Profile

```text
+--------------------------------------+
| Profile                              |
| [Name / Guest]                       |
| [Sign in, if guest]                  |
| [ Emergency information           >] |
| [ Trusted contacts                >] |
| [ Language and accessibility      >] |
| [ Privacy and permissions         >] |
| [ Help and service concerns       >] |
| [ Apply to become a responder ]      |
| [ Switch to responder mode* ]        |
| Home   Learn   Activity   Profile     |
+--------------------------------------+
```

Responder mode is visible only to approved, eligible users.

### U18 — Optional emergency information

```text
+--------------------------------------+
| < Emergency information              |
| Optional information                 |
| Last updated: [Date]                 |
| [ Name                             ] |
| [ Allergies                        ] |
| [ Current medications              ] |
| [ Relevant conditions              ] |
| Information is self-reported.        |
| Who can access this?              >  |
| [ Sharing preferences ]              |
| [ Save ]                             |
| [ Delete emergency information ]     |
+--------------------------------------+
```

Secondary feature. Never automatically expose to all nearby volunteers.

### U19 — Trusted contacts

```text
+--------------------------------------+
| < Trusted contacts                   |
| [Name] - [Relationship]              |
| [Edit] [Remove]                      |
| [ Add contact ]                      |
| Incident notifications               |
| [Choose when to notify]              |
| Explain what information is shared.  |
| [ Save preferences ]                 |
+--------------------------------------+
```

### U20 — Accessibility and privacy

Create two separate screens with this pattern:

```text
+--------------------------------------+
| < [Settings category]                |
| [Setting name]             [Control] |
| Supporting explanation               |
|                                      |
| [Setting name]             [Control] |
| Supporting explanation               |
| [ Save, where needed ]               |
+--------------------------------------+
```

Accessibility: language, text preferences, audio support, reduced motion.

Privacy: location permission explanation, emergency-profile access, notification preferences, account/data deletion requests.

## Responder mode

### R01 — Responder application

```text
+--------------------------------------+
| < Responder application              |
| Join the community programme         |
| [ Personal details                 ] |
| [ Relevant qualification           ] |
| [ Issuing organization             ] |
| [ Expiry date, if applicable       ] |
| [ Upload verification evidence ]     |
| [ Read responsibilities ]            |
| [ Submit application ]               |
+--------------------------------------+
```

### R02 — Verification status

```text
+--------------------------------------+
| Application status                   |
| [Pending / More information /        |
|  Approved / Not approved]            |
| Explanation and next step            |
| [Relevant action]                    |
| [ Contact programme support ]        |
| [ Return to public mode ]            |
+--------------------------------------+
```

Pending applicants cannot receive operational requests.

### R03 — Responder home

```text
+--------------------------------------+
| SWARN - Responder                    |
| Availability                         |
| [ Unavailable | Available ]          |
| Area: [Supported area]               |
| Qualification: [Status]              |
| [ Active assignment, if any ]        |
| Programme notice                     |
| [Refresher / verification notice]    |
| Availability Requests Activity       |
|                             Profile  |
+--------------------------------------+
```

Explain location use. Block availability when required verification expires.

### R04 — Incident invitation

```text
+--------------------------------------+
| Nearby request                       |
| Approximate area: [Area]              |
| Distance: [If available]              |
| Reported situation: [Description]    |
| Requested: [Time]                    |
| Information is caller-reported.      |
| [ ACCEPT REQUEST ]                   |
| [ Decline ]                          |
+--------------------------------------+
```

Minimal information before assignment. Explicitly update changes to assignment.

### R05 — Assigned incident

```text
+--------------------------------------+
| Assigned incident                    |
| [Scene map]                          |
| [Exact address]                      |
| Entrance: [Details]                  |
| [ Open navigation ]                  |
| [ Contact caller ]                   |
| Reported situation                >  |
| Professional response status         |
| [Confirmed information / Unknown]    |
| [ I HAVE ARRIVED ]                   |
| [ Unable to continue ]               |
+--------------------------------------+
```

Unable to continue triggers reassignment/escalation and updates the requester.

### R06 — On-scene coordination

```text
+--------------------------------------+
| At the scene                         |
| Arrived: [Time]                      |
| [ Contact professional service ]     |
| [ Contact coordinator ]              |
| Incident observations                |
| [ Add observation ]                  |
| [ Record action and time ]           |
| Authorized patient information    >  |
| [ PREPARE HANDOVER ]                 |
+--------------------------------------+
```

Minimize data entry during care; documentation must not take priority over approved responder responsibilities.

### R07 — Handover summary

```text
+--------------------------------------+
| < Handover summary                   |
| Incident reported: [Time]            |
| Responder arrived: [Time]            |
| Caller-reported information          |
| [Summary]                            |
| Responder observations               |
| [Summary with timestamps]            |
| Recorded actions                     |
| [Summary with timestamps]            |
| Missing information: [Listed]        |
| [ Show summary ]                     |
| [ Record handover ]                  |
+--------------------------------------+
```

No invented clinical values. Distinguish firsthand observations from other people's reports.

### R08 — Close participation

```text
+--------------------------------------+
| Close participation                  |
| What happened?                       |
| ( ) Handover completed               |
| ( ) Cancelled by coordinator         |
| ( ) Unable to complete response      |
| ( ) Other                           |
| [ Relevant details                 ] |
| [ Confirm ]                          |
| [ Report an issue ]                  |
| [ Access volunteer support ]         |
+--------------------------------------+
```

Closing participation does not record a medical outcome.

### R09 — Responder activity and profile

Reuse list/settings patterns for two separate screens:

```text
ACTIVITY
[Past assignments]
[Participation status]
[Own recorded handover summaries]
[Submit correction / report concern]

PROFILE
[Verified role]
[Qualification documents]
[Expiry and renewal]
[Training sessions]
[Notification preferences]
[Programme support]
[Switch to public mode]
```

## Coordinator desktop dashboard

### C01 — Overview

```text
+----------------------------------------------------------------+
| SWARN Coordinator       [Pilot area]             [Account]      |
+--------------+-------------------------------------------------+
| Overview     | Requests needing attention                      |
| Incidents    | [Unaccepted] [Assignment issue] [Other]          |
| Responders   |                                                 |
| Coverage     | Active incidents                                |
| Reviews      | ID | Area | Status | Assigned | Last update      |
| Settings     | [Incident row]                         [Open]   |
|              | [Incident row]                         [Open]   |
|              | Connection / data freshness indicator           |
+--------------+-------------------------------------------------+
```

No unsupported lives-saved metrics or performance scores.

### C02 — Incident detail

```text
+----------------------------------------------------------------+
| < Incidents       [Incident ID]            [Current status]     |
+-------------------------------+--------------------------------+
| Location and access           | Event timeline                 |
| [Map]                         | Request received               |
| [Address / entrance]          | Responder assigned             |
|                               | Status updates                 |
| Caller contact                | Handover / closure             |
| [Contact action]              | Notes with source and time     |
|                               | [Add coordination note]        |
| Assigned responder            |                                |
| [Name / verified role]        | Professional response status   |
| [Contact]                     | [Source / Unknown]             |
+-------------------------------+--------------------------------+
| [Manage assignment] [Resolve duplicate] [Close with reason]     |
+----------------------------------------------------------------+
```

### C03 — Responder verification

```text
+----------------------------------------------------------------+
| Responder applications                                         |
+------------------------+---------------------------------------+
| Applicants             | Selected applicant                    |
| [Pending]              | Identity and qualification            |
| [Needs information]    | Evidence documents                    |
| [Expiring]             | Verification history                  |
| [Applicant list]       | [Request information]                 |
|                        | [Approve] [Do not approve]             |
|                        | Reason / reviewer record              |
+------------------------+---------------------------------------+
```

### C04 — Coverage and availability

```text
+----------------------------------------------------------------+
| Coverage                         [Area filter]                 |
+-------------------------------+--------------------------------+
| Map of supported area         | Available verified responders  |
|                               | [Role / area / update time]    |
| Coverage limitations          | Verification or expiry issues  |
| clearly labelled              | [Open responder record]        |
+-------------------------------+--------------------------------+
```

Do not share exact responder locations beyond operational necessity.

### C05 — Incident review

```text
+----------------------------------------------------------------+
| Review incident [ID]                                           |
+----------------------------------------------------------------+
| Recorded timeline                                              |
| [Events and timestamps]                                        |
| Feedback                                                       |
| [Requester feedback] [Responder feedback]                      |
| Identified service issue                                       |
| [Category] [Notes]                                             |
| Follow-up owner: [Person / team]                                |
| Status: [Open / In progress / Resolved]                         |
| [Save review]                                                  |
+----------------------------------------------------------------+
```

## Required exception states

Design full screens, banners, or dialogs appropriate to severity.

| State | Required message and action |
|---|---|
| Location permission denied | Manual address and map-pin entry remain available. |
| Outside supported community | Explain community response is unavailable; retain emergency calling. |
| Request not sent | Say it was not delivered; offer retry and emergency calling. |
| Connection lost after sending | Last confirmed status and update time; never invent progress. |
| No responder accepted | State clearly; retain professional emergency contact. |
| Responder withdraws | Remove stale arrival information and explain reassignment status. |
| Cannot find responder | Offer contact and location/access correction. |
| Possible duplicate | Coordinator reviews and links records; never silently discard. |
| Accidental request | Confirm cancellation and notify affected responders. |
| Verification expired | Disable availability and show renewal steps. |
| Failed information update | Preserve input and offer retry. |
| Session expired | Preserve emergency calling and explain account recovery. |

### Cancellation dialog

```text
+--------------------------------------+
| Cancel community request?            |
| Assigned responders will be          |
| notified. This does not cancel       |
| any separate emergency call.         |
|                                      |
| [ Keep request active ]              |
| [ Cancel community request ]         |
+--------------------------------------+
```

### No-responder state

```text
+--------------------------------------+
| No responder has accepted            |
| Community assistance is not          |
| confirmed.                           |
|                                      |
| [ Call emergency services ]          |
| [ View current request status ]      |
| Last confirmed update: [Time]        |
+--------------------------------------+
```

## Expected deliverables from Claude

1. Consistent typography, colours, spacing, buttons, inputs, status messages, cards, navigation, and accessible interaction states.
2. All numbered public and responder screens, reusing shared patterns. U20 and R09 each expand into two screens as described.
3. All five coordinator dashboard screens.
4. Listed exception states and relevant loading, empty, validation, and success states.
5. Connected prototypes for requesting help; no responder accepting; responder acceptance, arrival, and handover; and coordinator assignment resolution.
6. An annotated screen map showing navigation and conditional branches.

Prioritize the core emergency journey before secondary profile features, while preserving the complete inventory for a coherent service.
