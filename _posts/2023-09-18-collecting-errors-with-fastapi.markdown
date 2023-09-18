---
layout: post
title:  "Collecting Validation Errors in FastAPI/Pydantic"
date:   2023-09-18 12:00:00 +0000
categories: fastapi pydantic
published: true
---
FastAPI has become a popular choice for building APIs, largely due to its foundational architecture atop the [Starlette framework](https://www.starlette.io/) and [Pydantic library](https://github.com/pydantic/pydantic). While it provides impressive speed and an array of features, one of its standout functionalities is robust request validation using Pydantic.

However, sometimes the out-of-the-box validation mechanisms aren't enough to cover more complex requirements, such as conditional validation. Fortunately, FastAPI provides powerful tools for extending these capabilities, like `Field` and `Model` validators.

Although FastAPI's built in (Pydantic) validation is enough in most cases, occassionally additional validation is required - for example, when dealing conditional validation. Fortunately, this can be achieved using [Field](https://docs.pydantic.dev/latest/usage/validators/#field-validators) and [Model validators](https://docs.pydantic.dev/latest/usage/validators/#model-validators).

However, the default behaviour of FastAPI (Pydantic) in a custom validator is to surface an exception immediately after encountering it. When building a backend for a web service, etc., it can be useful to collect all errors before returning to the user. To validate everything before returning we can utilise a `model_validator` with `mode='wrap'`, and `validation_error.from_exception_data()`.

## Solution
Obvious improvement can be made to the following code - the use of enums for height-type, for example. However, this is a bare-bones example of how to collect and return validation errors in one go.

<script src="https://gist.github.com/JKFSOM/f694e5dcd1081eada511d456c75f312f.js"></script>
