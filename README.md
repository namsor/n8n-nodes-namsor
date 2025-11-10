# n8n-nodes-namsor

Official **Namsor integration** for [n8n](https://n8n.io/): AI-powered name analysis and demographic predictions.

> Namsor predicts gender, origin, ethnicity, and other demographics from personal names using AI.  
> Supports 190+ countries and multiple name formats.

---

## 🧭 Table of Contents

1. [Overview](#overview)  
2. [Installation](#installation)  
3. [Authentication & Credentials](#authentication--credentials)  
4. [Features](#features)  
5. [Supported Operations](#supported-operations)  
6. [Usage Examples](#usage-examples)  
7. [Output Reference](#output-reference)  
8. [Credits, Limits & Privacy](#credits-limits--privacy)  
9. [Error Handling](#error-handling)  
10. [Compatibility](#compatibility)  
11. [Resources](#resources)  
12. [Version History](#version-history)  
13. [License & Support](#license--support)

---

## 🧩 Overview

This node integrates the **Namsor API** within n8n, enabling name-based predictions such as:

- Gender detection  
- Country or region of origin  
- Ethnicity and diaspora classification  
- Country of residence estimation  
- U.S. race/ethnicity classification (6 classes)  
- Indian caste prediction  
- Name parsing and name-type recognition  

---

## ⚙️ Installation

Follow the [official community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

### Steps

1. Go to **Settings → Community Nodes** in n8n  
2. Click **Install**  
3. Enter `n8n-nodes-namsor`  
4. Accept the [community node risks](https://docs.n8n.io/integrations/community-nodes/risks/)  
5. Click **Install**

The node will then appear in your **palette**.

---

## 🔐 Authentication & Credentials

### 1. Get Your API Key
- Go to [namsor.app](https://namsor.app/) → [My Account](https://namsor.app/my-account/)  
- Create an account (2,500 free credits/month)  
- Copy your API key

### 2. Add Credentials in n8n
1. Open a Namsor node  
2. Click **Credential to connect with → Create New Credential**  
3. Paste your API key  
4. Save  

**Each request** uses the header `X-API-KEY`.

---

## 💡 Features

- **Batch Processing** (up to 200 names per request)  
- **Geo-aware Endpoints** (automatic detection based on `countryIso2`)  
- **Country Context** improves accuracy (ISO 3166-1 alpha-2)  
- **Simplified Output Mode**  
- **Support for 190+ countries** & **38 Indian subdivisions (ISO 3166-2:IN)**  

---

## 🧠 Supported Operations

### Gender Prediction
Predict gender from name(s).  
- By Name or Full Name  
- Output: gender, probability score

### Origin
Predict likely country or region of origin.  
- Output: Top 10 countries, region/sub-region, probability

### Ethnicity / Diaspora
Classify by ethnicity or diaspora group.  
- Output: Top 10 ethnicities, probability score

### Country of Residence
Estimate current country of residence.  
- Output: Top 10 countries, region, sub-region, probability

### US Race/Ethnicity (6 Classes)
Classify names according to US Census categories.  
- Classes: W_NL, HL, A, B_NL, AI_AN, PI  
- Output: classification and probability scores

### Indian Caste
Predict caste group based on name + subdivision.  
- Output: Top 5 caste groups, probability

### Name Parsing
Split a full name into first and last name.

### Name Type Recognition
Identify if a name is a person, brand, pseudonym, or place.  
- Types: anthroponym, brand-name, pseudonym, toponym  

---

## 📘 Usage Examples

### Basic Example — Gender Prediction
1. Add **Namsor** node  
2. Resource: **Gender**  
3. Operation: **Predict by Name**  
4. Provide first & last name  
5. Optionally add country code (ISO 3166-1 alpha-2)  
6. Toggle **Simplify** for clean output  

### Batch Example
1. Use **Set** or **Code** node to prepare an array  
2. Send to **Namsor** node  
3. Process up to 200 names  
4. Responses maintain order

### Country Context Example
```
First Name: "Andrea"
Last Name: "Rossi"
Country: "IT"
→ Correctly predicts male (Italy context)
```

---

## 📊 Output Reference

| Category | Key Info |
|-----------|-----------|
| **Gender** | `likelyGender`: male/female — `probabilityCalibrated`: 0–1 |
| **US Race/Ethnicity** | Taxonomy: USRACEETHNICITY-6CLASSES — Codes: W_NL, HL, A, B_NL, AI_AN, PI |
| **Ethnicity (Diaspora)** | Categories: [API Enumerators](https://namsor.app/api-enumerators/#diasporas) |
| **Name Type Recognition** | `commonType` / `commonTypeAlt` ∈ {anthroponym, brand-name, pseudonym, toponym} |
| **Script** | ISO 15924 values: Latin, Cyrillic, Arabic, etc. |
| **Region/SubRegion** | UN statistical regions and subregions |

---

## ⚖️ Credits, Limits & Privacy

- Credit system per plan ([Pricing](https://namsor.app/pricing))  
- Free: 2,500 credits/month  
- Paid: scalable quotas  
- Batch limit: 200 names/request  
- “Soft” vs “Hard” API usage limits  
- Privacy options:  
  - `learnable=false` → don’t store requests  
  - `anonymized=true` → hide raw names  

---

## ⚠️ Error Handling

| Code | Description |
|------|--------------|
| 401 | Invalid/missing API key |
| 403 | Credit limit reached |
| 404 | Endpoint not found |
| 500 | Internal server error |

---

## 🧩 Compatibility

- Minimum n8n version: **1.0.0**  
- Tested on: **1.60.0+**  
- API version: **1 (declarative routing)**  

---

## 🔗 Resources

- [Namsor API Documentation](https://namsor.app/api-documentation/)  
- [API Enumerators](https://namsor.app/api-enumerators/)  
- [n8n Community Nodes Docs](https://docs.n8n.io/integrations/community-nodes/)  
- [Namsor Pricing](https://namsor.app/pricing/)  
- [Get API Key](https://namsor.app/my-account/)  

---

## 🕓 Version History

### 0.1.0 — Initial Release
All features implemented:
- Gender, Origin, Ethnicity, Country of Residence, US Race/Ethnicity, Indian Caste  
- Name Parsing, Type Recognition  
- Geo/classic endpoint auto-switch  
- Simplified mode & batch support (200 max)  
- Error handling, validation, and full ISO support  

---

## 📜 License & Support

- License: [MIT](LICENSE)  
- Author: **AgrapheP / Namsor**  
- Support:  
  - [GitHub Repository](https://github.com/namsor/n8n-nodes-namsor)  
  - [n8n Community Forum](https://community.n8n.io/)

---

Made with ❤️ for the n8n community
