# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-10

### Added

**Complete Namsor API Integration - All Features Implemented**

#### Resources
- **Gender Prediction**: Predict gender from names
  - Predict by Name (first + last name, with optional country context)
  - Predict by Full Name (complete name string, with optional country context)
  - Automatic geo/classic endpoint selection
- **Origin Analysis**: Determine geographic origin
  - Predict by Name (first + last name)
  - Predict by Full Name (complete name string)
  - Returns top 5 countries, region, and sub-region
- **Ethnicity/Diaspora Classification**: Identify ethnicity
  - Predict by Name (last name required, optional first name + country)
  - Predict by Full Name (complete name string, optional country)
  - Returns top 5 ethnicities ranked by probability
- **Country of Residence**: Predict likely country of residence
  - Predict by Name (first + last name)
  - Predict by Full Name (complete name string)
  - Returns top 5 countries with region information
- **US Race/Ethnicity Classification**: US Census categories (6 classes)
  - Predict by Name (first + last name, optional country)
  - Predict by Full Name (complete name string, optional country)
  - Categories: W_NL, HL, A, B_NL, AI_AN, PI
- **Indian Caste Prediction**: Predict Indian caste groups
  - Predict by Name (first + last name + Indian subdivision)
  - Predict by Full Name (complete name string + Indian subdivision)
  - Returns top 5 caste groups
- **Name Parsing**: Split full names into components
  - Split Full Names operation
  - Automatic geo/classic endpoint selection
  - Returns parsed first name and last name
- **Name Type Recognition**: Identify proper noun types
  - Recognize Type operation
  - Automatic geo/classic endpoint selection
  - Types: anthroponym, brand-name, pseudonym, toponym

#### Features
- Support for 190+ countries (ISO 3166-1 alpha-2 codes)
- Support for 38 Indian subdivisions (ISO 3166-2:IN)
- Batch processing up to 200 names per API request
- Simplified output mode for all resources
- Raw output mode for complete API responses
- Country context support for improved accuracy
- Comprehensive input validation (min 1, max 200 items)
- Error handling with clear user messages
- Automatic geo/standard endpoint detection
- Complete documentation (README, usage examples)
- MIT License

### Technical Details
- Built with n8n-node CLI tool
- Uses n8n API version 1 (declarative routing)
- TypeScript strict mode enabled
- Follows n8n UX guidelines and verification standards
- Zero runtime dependencies (peerDependencies only)
- ESLint and Prettier configured
- CI/CD with GitHub Actions

[unreleased]: https://github.com/namsor/n8n-nodes-namsor/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/namsor/n8n-nodes-namsor/releases/tag/v0.1.0
