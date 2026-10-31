---
number: 10
slug: what-are-ai-agents
type: definitions
category: explainer
service: ai
title: "What Are AI Agents and How Do They Differ? | DECHY Tech"
description: "What an AI agent is, how it differs from a chatbot and from ordinary automation, where agents help a business, and how to keep them safe."
h1: What are AI agents, and how do they differ from chatbots and automation?
summary: An AI agent can plan and carry out steps on its own, using your tools. This guide explains how that differs from a chatbot or a workflow, and when an agent is worth it.
intent: what an AI agent is and how it differs from chatbots and automation
date: 2026-10-20
cta: Thinking about where an AI agent could help?
---

## A plain definition

An AI agent is software that is given a goal and works out the steps to reach it. It reads the situation, decides what to do next, uses tools such as your calendar or customer records, checks the result, and repeats until the goal is met or it needs a person.

The engine inside most agents is a large language model (LLM). This is the kind of AI that reads and writes language, the same kind behind popular assistants. On its own, a language model only produces text. An agent wraps that model in rules, tools, and memory so it can act, not just answer.

The important word is "act". A chatbot replies. An agent does things. That difference brings both the value and the risk.

## How an agent differs from a chatbot

A chatbot holds a conversation. It answers questions, often from a fixed set of help articles, and hands over to a person when it gets stuck. It does not usually change anything in your systems.

An agent can take the next step. Asked to rebook a delivery, a chatbot explains how. An agent checks the order, finds a free slot, books it, and confirms with the customer. It may ask a person to approve before it changes anything important.

- A chatbot answers; an agent acts
- A chatbot follows a script; an agent plans the steps
- A chatbot rarely touches your systems; an agent uses them as tools

## How an agent differs from automation

Ordinary automation follows fixed rules. When a form arrives, create a record, send an email, notify the team. It is fast, cheap, and predictable, and it does exactly the same thing every time.

An agent handles work that does not fit fixed rules. It can read a messy email, work out what the sender wants, and choose between several actions. That flexibility is useful when inputs vary. It is wasteful when they do not.

A good rule of thumb is to automate first and add an agent only where judgment is genuinely needed. Many processes that look like they need AI are better served by clear rules and a reliable integration. Our guide to [business process automation](/resources/guides/business-process-automation-where-to-start/) covers that starting point.

## Where agents help a business

Agents earn their place where work involves reading, deciding, and acting across several tools. Customer support is a common example. An agent can read a request, look up the order, apply the refund policy, and draft a reply for a person to approve.

Operations work is another. An agent can watch incoming documents, extract the details, match them to records, and flag anything unusual. Sales teams use agents to research a prospect, summarize past conversations, and prepare a first draft of a proposal.

- Triage and reply to customer requests, with approval for anything that changes money or data
- Read invoices, contracts, and forms, and fill in the right records
- Prepare research and first drafts for staff to review
- Chase routine follow-ups across email and the customer system

## What can go wrong

Because agents act, mistakes have consequences. A language model can misread a request or state something untrue with confidence. An agent with too much access can change records it should not touch. An attacker can hide instructions inside a document or an email to steer the agent. This is called prompt injection.

None of these risks is a reason to avoid agents. They are reasons to design them carefully. The same care you would give a new member of staff applies here. Give clear limits, the minimum access needed, supervision at the start, and a record of everything they do.

## How to keep agents safe

Start with narrow permissions. An agent should only reach the tools and data its task needs, and only in the ways that task needs. Reading an order is different from issuing a refund.

Put a person in the loop for anything that matters. Refunds, contract changes, and messages to important customers should wait for approval, at least until the agent has a track record. Keep a full log of what the agent saw, decided, and did, so any result can be explained.

Test before launch and keep testing after. Build a set of realistic examples, including awkward and hostile ones, and check the agent's behavior against them every time something changes.

- Grant the least access the task needs
- Require approval for actions that change money, data, or commitments
- Log every step so decisions can be explained
- Test against realistic and hostile examples before and after launch

## How to start

Pick one task that is frequent, well understood, and currently costs real time. Describe it the way you would to a new colleague: what arrives, what good looks like, and when to ask for help. That description becomes the agent's brief.

Build the smallest useful version, with approval on every action, and run it alongside the current process. Measure how often it gets things right and how much time it saves. Loosen the approvals only where the evidence supports it.

If the task turns out to follow fixed rules after all, replace the agent with simple automation. That is a good outcome, not a failure. You can see how we approach these projects on our [AI and machine learning](/ai/) page.

## An example in practice

Imagine a wholesale business that receives hundreds of order emails a week. Some are clear, some include changes to earlier orders, and some ask questions about stock. Today, two people read each email and type the details into the order system.

An agent can take the first pass. It reads each email, works out whether it is a new order, a change, or a question, and looks up the customer and products. For a clear new order, it prepares the order and places it in a queue for a person to confirm with one click. For a change, it shows the old and new versions side by side. For a question, it drafts a reply using current stock levels.

The people who used to type every order now review and approve. Their work moves from copying to checking, and the unusual cases get more of their attention. Over time, the business may let the agent place routine orders from trusted customers without approval, while anything unusual still goes to a person.

## What it costs to run

Agents have running costs that ordinary software does not. Each step the agent takes usually involves a call to a language model, and those calls are priced by the amount of text processed. A task that takes ten steps costs more than one that takes two, so keeping tasks focused keeps costs down.

There are also costs in looking after the agent. Its instructions need updating when policies change. Its tests need new examples as new situations appear. Someone needs to review the log and the approval queue. Budget for this the way you would budget for any member of a team.

Set spending limits from the start. A good design caps how many steps an agent can take on one task and how much it can spend in a day, and alerts a person when either limit is reached.

## Common questions

### Is an AI agent the same as an AI assistant?

Not quite. An assistant usually answers and suggests. An agent goes further and takes actions in your tools, often with approval for anything important.

### Do we need our own AI model?

Usually not. Most agents use an existing language model from a major provider, combined with your rules, tools, and data.

### Can an agent make decisions on its own?

It can, within the limits you set. We recommend approval for any action that changes money, data, or commitments until the agent has proven itself.

### How do we know the agent is working?

By measuring it against a fixed set of realistic examples, reviewing its log, and tracking how often people correct it.
