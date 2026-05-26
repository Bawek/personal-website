# Skill Slug Validation Fix Design

## Overview

The bug occurs because the Mongoose schema requires the `slug` field, but the pre-save hook that generates the slug runs after validation. This creates a chicken-and-egg problem: validation fails because slug is missing, but the slug generation code never executes because validation fails first. The fix involves either making the slug field optional in the schema or moving slug generation to occur before validation by using a pre-validate hook instead of a pre-save hook.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a skill is created without an explicit slug value
- **Property (P)**: The desired behavior when skills are created - slug should be auto-generated from the name before validation
- **Preservation**: Existing slug-based operations (GET, PUT, DELETE by slug) and explicit slug provision that must remain unchanged by the fix
- **skillSchema.pre('save')**: The Mongoose middleware hook in `backend/models/Skill.js` that currently attempts to generate slugs after validation
- **slug field**: The required unique identifier field in the Skill schema that is derived from the skill name
- **Mongoose validation**: The schema validation phase that occurs before the pre-save hook executes

## Bug Details

### Bug Condition

The bug manifests when a skill is created via the POST /api/skills endpoint without an explicit slug value. The Mongoose schema validation fails because the `slug` field is marked as required, but the pre-save hook that generates the slug from the name has not yet executed (pre-save hooks run after validation).

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type SkillCreationRequest
  OUTPUT: boolean
  
  RETURN input.slug IS undefined OR input.slug IS null
         AND input.name IS defined
         AND requestMethod IS 'POST'
         AND endpoint IS '/api/skills'
END FUNCTION
```

### Examples

- **Example 1**: POST /api/skills with `{ name: "React", category: "frontend", level: "advanced" }` → Expected: Creates skill with slug "react" | Actual: Validation error "slug: Path `slug` is required"
- **Example 2**: POST /api/skills with `{ name: "Node.js", category: "backend", level: "expert" }` → Expected: Creates skill with slug "node-js" | Actual: Validation error "slug: Path `slug` is required"
- **Example 3**: POST /api/skills with `{ name: "PostgreSQL", category: "database", level: "intermediate" }` → Expected: Creates skill with slug "postgresql" | Actual: Validation error "slug: Path `slug` is required"
- **Edge Case**: POST /api/skills with `{ name: "C++", category: "backend", level: "advanced" }` → Expected: Creates skill with slug "c" (after removing special characters)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Skills created with an explicit slug value must continue to use that slug
- Slug regeneration when updating a skill's name must continue to work
- GET /api/skills/:slug must continue to retrieve skills by slug
- PUT /api/skills/:slug must continue to update skills by slug
- DELETE /api/skills/:slug must continue to delete skills by slug
- Duplicate name checking must continue to prevent duplicate skill names per user
- Slug uniqueness constraint must continue to be enforced

**Scope:**
All inputs that involve explicit slug provision or operations on existing skills should be completely unaffected by this fix. This includes:
- Skill creation with explicit slug values
- Skill updates that change the name (triggering slug regeneration)
- All read, update, and delete operations using slug as identifier

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Mongoose Validation Order**: Mongoose runs schema validation before pre-save hooks
   - The `slug` field is marked as `required: true` in the schema
   - The pre-save hook attempts to generate the slug after validation
   - Validation fails because slug is undefined, preventing the hook from executing

2. **Pre-Save Hook Timing**: The current implementation uses `skillSchema.pre('save')` which executes after validation
   - This is too late in the lifecycle to generate required fields
   - The hook condition `!this.slug` is never reached because validation fails first

3. **Missing Default or Pre-Validation Logic**: The schema lacks either:
   - A default value generator for the slug field, OR
   - A pre-validate hook that generates the slug before validation occurs

## Correctness Properties

Property 1: Bug Condition - Auto-Generated Slug Creation

_For any_ skill creation request where no explicit slug is provided (isBugCondition returns true), the fixed Skill model SHALL automatically generate a slug from the skill name before validation occurs, allowing the skill to be created successfully with a properly formatted slug.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Explicit Slug and Existing Operations

_For any_ skill operation where an explicit slug is provided or where the operation involves existing skills (isBugCondition returns false), the fixed code SHALL produce exactly the same behavior as the original code, preserving slug-based retrieval, updates, deletions, and explicit slug provision functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `backend/models/Skill.js`

**Function**: `skillSchema.pre('save')` middleware hook

**Specific Changes**:

1. **Option A - Use Pre-Validate Hook (Recommended)**:
   - Replace `skillSchema.pre('save')` with `skillSchema.pre('validate')`
   - This ensures slug generation occurs before validation
   - Maintains the same slug generation logic
   - Minimal code change with clear intent

2. **Option B - Make Slug Optional with Default**:
   - Remove `required: true` from the slug field definition
   - Keep the pre-save hook as is
   - Add validation to ensure slug is always present after save
   - More complex but provides flexibility

3. **Option C - Use Schema Default Function**:
   - Add a `default` function to the slug field that generates from name
   - Remove or modify the pre-save hook
   - Requires access to `this.name` in the default function context

**Recommended Approach**: Option A (Pre-Validate Hook)

**Implementation**:
```javascript
// Change from:
skillSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// To:
skillSchema.pre('validate', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});
```

4. **Update Condition Logic**: Ensure the hook generates slug for new documents
   - Current condition: `this.isModified('name') && !this.slug`
   - This correctly handles both new documents and name updates
   - No change needed to the condition logic

5. **Verify Slug Generation Logic**: The slug transformation is correct
   - Converts to lowercase
   - Replaces non-alphanumeric characters with hyphens
   - Removes leading/trailing hyphens
   - No change needed to the transformation logic

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that attempt to create skills without explicit slug values through the POST /api/skills endpoint. Run these tests on the UNFIXED code to observe validation failures and confirm the root cause.

**Test Cases**:
1. **Basic Skill Creation**: POST with `{ name: "React", category: "frontend", level: "advanced" }` (will fail on unfixed code with "slug: Path `slug` is required")
2. **Special Characters in Name**: POST with `{ name: "Node.js", category: "backend", level: "expert" }` (will fail on unfixed code)
3. **Multiple Word Name**: POST with `{ name: "Machine Learning", category: "other", level: "intermediate" }` (will fail on unfixed code)
4. **Edge Case - Special Characters Only**: POST with `{ name: "C++", category: "backend", level: "advanced" }` (will fail on unfixed code)

**Expected Counterexamples**:
- All POST requests without explicit slug values fail with validation error
- Error message: "Skill validation failed: slug: Path `slug` is required"
- Confirms that validation occurs before pre-save hook execution

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := createSkill_fixed(input)
  ASSERT result.success = true
  ASSERT result.skill.slug IS defined
  ASSERT result.skill.slug = generateSlugFromName(input.name)
  ASSERT result.statusCode = 201
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT createSkill_original(input) = createSkill_fixed(input)
  ASSERT getSkillBySlug_original(slug) = getSkillBySlug_fixed(slug)
  ASSERT updateSkillBySlug_original(slug, data) = updateSkillBySlug_fixed(slug, data)
  ASSERT deleteSkillBySlug_original(slug) = deleteSkillBySlug_fixed(slug)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for explicit slug provision and existing skill operations, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Explicit Slug Preservation**: Observe that POST with explicit slug works on unfixed code, then verify this continues after fix
2. **Slug Retrieval Preservation**: Observe that GET /api/skills/:slug works on unfixed code, then verify this continues after fix
3. **Slug Update Preservation**: Observe that PUT /api/skills/:slug works on unfixed code, then verify this continues after fix
4. **Slug Deletion Preservation**: Observe that DELETE /api/skills/:slug works on unfixed code, then verify this continues after fix
5. **Name Change Slug Regeneration**: Observe that updating a skill's name regenerates the slug on unfixed code (if testable), then verify this continues after fix

### Unit Tests

- Test skill creation without explicit slug for various skill names
- Test skill creation with explicit slug value
- Test slug generation for names with special characters
- Test slug generation for multi-word names
- Test slug uniqueness constraint enforcement
- Test duplicate name prevention per user
- Test skill retrieval by slug
- Test skill update by slug with name change
- Test skill deletion by slug

### Property-Based Tests

- Generate random skill names and verify slugs are correctly generated
- Generate random skill data and verify creation succeeds with auto-generated slugs
- Generate random existing skills and verify all CRUD operations continue to work
- Test that slug format always matches the pattern: lowercase alphanumeric with hyphens

### Integration Tests

- Test full skill creation flow from API endpoint to database
- Test skill creation followed by retrieval by the generated slug
- Test skill creation, update with name change, and verify slug regeneration
- Test multiple skill creation with similar names to verify uniqueness
- Test authenticated skill creation with user context
