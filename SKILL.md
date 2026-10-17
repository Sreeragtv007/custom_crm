---
name: custom-crm-app
description: >-
  Use this skill when customizing Frappe CRM via the custom_crm app, managing fixtures,
  injecting custom scripts, or styling CRM views.
---

# Custom CRM Skill

This skill provides procedures for maintaining and extending the `custom_crm` app.

## Common Procedures

### 1. Exporting and Syncing Fixtures
When you add or update Custom Fields or CRM Form Scripts:
```bash
# 1. Export fixtures from the target site
bench --site test.localhost export-fixtures --app custom_crm

# 2. Check the exported changes
git -C apps/custom_crm status
git -C apps/custom_crm diff fixtures/

# 3. Migrate changes to ensure consistency
bench --site test.localhost migrate
```

### 2. Modifying Custom Priority Styling
- Edit `custom_crm/custom_crm/public/js/crm_list_priority.js`.
- Clear browser cache and bench cache:
  ```bash
  bench --site test.localhost clear-cache
  bench build --app custom_crm
  ```

### 3. Adding New Route Rules or Hooks
- Modify `custom_crm/custom_crm/hooks.py`.
- Run `bench --site test.localhost clear-cache` to reload hooks configuration.
