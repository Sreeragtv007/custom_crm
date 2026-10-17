# Custom CRM — Project Context

## What this project is

`custom_crm` is a bench extension app designed to customize Frappe CRM without modifying upstream repository files. It contains exported fixtures (Custom Fields and CRM Form Scripts), public JS assets for list styling, and routing overrides.

- **App Name**: `custom_crm`
- **Publisher**: sreerag
- **License**: MIT
- **Branch**: version-16 / test

---

## Where to read before working

| Feature | Key File |
|---|---|
| Fixture definitions & hooks | `custom_crm/hooks.py` |
| Exported Form Scripts | `custom_crm/fixtures/crm_form_script.json` |
| Exported Custom Fields | `custom_crm/fixtures/custom_field.json` |
| Custom CRM list priority script | `custom_crm/public/js/crm_list_priority.js` |
| Web route override & template | `custom_crm/www/crm.py`, `crm.html` |

---

## Key files & Architecture

### Fixtures System
Configured in `custom_crm/hooks.py`:
- `Custom Field` for `Lead` and `CRM Lead` DocTypes
- `CRM Form Script` for priority colors (`CRM Lead Priority Color`, `CRM Lead Priority List Color`)

Fixtures are stored under `custom_crm/fixtures/` and automatically imported into the active site during `bench migrate`.

### Template & Script Injections
- `custom_crm/www/crm.py`: Imports and re-exports context from `crm.www.crm`.
- `custom_crm/www/crm.html`: Extends the upstream `crm/www/crm.html` template and injects `<script src="/assets/custom_crm/js/crm_list_priority.js" defer></script>`.
- `custom_crm/public/js/crm_list_priority.js`: Injects color-coded badges for CRM priorities in list and Kanban views.

---

## Workflows & Fixture Management

1. **Making changes in UI or Form Scripts**:
   - Create or edit the Form Script or Custom Field via Frappe Desk.
2. **Exporting to the app**:
   ```bash
   bench --site test.localhost export-fixtures --app custom_crm
   ```
3. **Applying fixtures on sites**:
   ```bash
   bench --site test.localhost migrate
   ```
4. **Building assets**:
   ```bash
   bench build --app custom_crm
   ```

---

## Coding Rules & Conventions

- Do not modify core `crm` files directly for local site customizations; place all overrides in `custom_crm`.
- Always inspect `git diff` on fixture JSON files before committing to avoid accidental fixture bloat.
