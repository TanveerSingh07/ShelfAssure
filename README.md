# ShelfAssure

### Intelligent Packaging Decisions, Engineered from the Food Up

ShelfAssure is a **data-driven packaging decision platform** that helps
food manufacturers identify suitable packaging structures based on
product properties, storage conditions, shelf-life requirements,
technical constraints, cost, and sustainability.

Instead of relying on manual trial-and-error, ShelfAssure converts
product and environmental information into measurable packaging
requirements, filters unsuitable materials, compares feasible
structures, and produces an **explainable packaging recommendation**.

------------------------------------------------------------------------

## The Problem

Food packaging selection is a multi-variable engineering problem. A
suitable package must provide protection against factors such as
**oxygen, moisture, light, temperature, and mechanical stress**, while
also satisfying shelf-life, cost, manufacturability, and sustainability
requirements.

Traditional selection can involve repeated experimentation, scattered
material data, and difficult performance-versus-cost trade-offs.

**ShelfAssure brings this decision process into one structured
workflow.**

------------------------------------------------------------------------

## How It Works

### 1. Define the Product

Users select a food category and enter properties such as moisture
content, fat/oil content, water activity, pH, and target shelf life.

### 2. Define Real-World Conditions

The system considers storage temperature, relative humidity, storage
environment, transportation conditions, and retail/light exposure.

### 3. Derive Packaging Requirements

ShelfAssure converts these inputs into measurable requirements such as:

-   Oxygen Transmission Rate (OTR)
-   Water Vapor Transmission Rate (WVTR)
-   Light protection
-   Mechanical strength
-   Sealability
-   Temperature suitability

### 4. Screen Candidate Structures

Packaging structures are evaluated against the requirements. **Hard
technical constraints are applied first**, so a material cannot become a
recommendation simply because it is cheaper or more sustainable while
failing a critical protection requirement.

### 5. Compare Feasible Options

Remaining candidates are compared using barrier performance, estimated
shelf life, cost, sustainability, and overall fit.

### 6. Generate an Explainable Recommendation

The platform provides the selected structure, fit score, estimated shelf
life, layer composition, technical properties, requirement compliance,
and validation considerations.

------------------------------------------------------------------------

## Key Features

-   **Constraint-Based Screening** --- eliminates structures that fail
    critical requirements.
-   **Multi-Factor Ranking** --- compares protection, shelf life, cost,
    sustainability, and overall suitability.
-   **What-If Analysis** --- evaluates how changes in temperature,
    humidity, or other conditions affect suitability.
-   **Materials Library** --- explore OTR, WVTR, temperature range,
    cost, and end-of-life characteristics.
-   **Explainable Recommendations** --- shows the evidence and
    requirements behind each recommendation.
-   **Saved Analyses** --- revisit and reproduce previous packaging
    decisions.
-   **Ask ShelfAssure** --- an intelligent assistant for packaging
    concepts, material properties, and testing-related information.
-   **Report Generation** --- export analyses for documentation and
    technical review.

------------------------------------------------------------------------

## Example: Potato Chips

For a potato-chip analysis, ShelfAssure considers product properties
such as moisture, fat content, water activity, and pH, together with
shelf-life and ambient storage conditions.

In the demonstrated analysis:

-   **15** candidate structures evaluated
-   **12** structures rejected by defined constraints
-   **3** feasible options remained
-   Recommended structure: **High-Barrier MET-BOPP/BOPP**
-   Estimated shelf life: **182--226 days**
-   Target shelf life: **120 days**
-   Fit score: **74/100**

The recommendation can also be compared with alternatives such as
PET-based and aluminium-foil laminates, making performance, cost, and
sustainability trade-offs visible.

> **Note:** ShelfAssure is a decision-support system. Physical testing,
> regulatory review, and production validation remain necessary before
> commercial deployment.

------------------------------------------------------------------------

## Core Decision Flow

``` text
Food Product
     ↓
Product Properties
     ↓
Storage & Transportation Conditions
     ↓
Packaging Requirements
     ↓
Candidate Screening
     ↓
Constraint Validation
     ↓
Feasible Candidates
     ↓
Multi-Factor Comparison
     ↓
Explainable Recommendation
     ↓
Report / Validation
```

------------------------------------------------------------------------

## Why ShelfAssure?

**Faster** --- reduces manual comparison and repetitive evaluation.

**Transparent** --- clearly shows why a structure is suitable.

**Data-driven** --- uses measurable product and material properties.

**Traceable** --- preserves inputs, requirements, and recommendations.

**Practical** --- combines technical performance with cost and
sustainability trade-offs.

------------------------------------------------------------------------

## Vision

ShelfAssure connects **food science, packaging engineering, material
data, and intelligent decision support** in one platform.

The goal is to move packaging teams from:

> "What packaging should we use?"

to:

> "Here are the requirements, the feasible options, and the evidence
> behind the recommendation."

------------------------------------------------------------------------

## One-Line Pitch

> **ShelfAssure turns food properties and real-world conditions into
> clear, explainable packaging decisions.**

## Getting Started

1. Run `npm install`
2. Run `npm run dev`
