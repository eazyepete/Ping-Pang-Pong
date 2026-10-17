---
name: Reviewed implementation handoff
about: Define a future change for explicit owner authorization and PR review
title: "[Handoff] "
labels: ""
assignees: ""
---

## Status and ownership
PROPOSED — not authorized for implementation.
Owner: Pete
Implementer:
Independent reviewer: ChatGPT/Pete OS

## Problem and expected behavior
Include a concrete before/after example.

## Authorization and source
- Owner authorization link:
- Source review issue:
- Repository, branch, full base SHA:
- Allowed paths:
- Out-of-scope paths and actions:
- Source snapshot reconciled with the intended working copy:

## Acceptance plan
List observable criteria and appropriate checks before implementation.
Do not pre-check boxes or copy results from another version.
- [ ] Requested behavior is verified with version-specific evidence.
- [ ] Existing behavior is preserved with appropriate checks.
- [ ] Diff contains only authorized changes and no sensitive material.
- [ ] Reviewer independently checks findings and evidence.
- [ ] Pete explicitly approves merge.

## Delivery
Feature branch / PR:
Changed files and reason:
Check | PASS/FAIL/NOT RUN/BLOCKED | method/environment/date | evidence:
Risks / missing checks:
Rollback plan:
Next owner/action:

All changes require a feature branch and PR. No direct main writes or merge
without owner approval. Release, deployment, credentials, permissions, paid
changes, and device installation require separate explicit authorization.
