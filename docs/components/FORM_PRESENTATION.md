# Form presentation components

`UiField`, `UiFieldMessage`, and `UiFormActions` provide reusable form presentation without owning validation, models, submission, navigation, API calls, or business rules. They support direct imports; installing the UI Kit plugin is optional.

## UiField

Use `UiField` to associate a label, hint, error, or success message with a consumer-owned control.

```vue
<UiField id="email" label="Email" hint="Use your work address" :errors="emailErrors" required>
  <template #default="control">
    <input v-model="email" v-bind="control" />
  </template>
</UiField>
```

Props: `id`, `label`, `hint`, `errors`, `success`, `required`, `disabled`, `readonly`, and `direction`. There are no emits. Slots are `default`, `label`, `hint`, `error`, `success`, and `action`. The default/action slots receive native control attributes; the error slot receives `errors`.

When no ID is supplied, Vue generates an instance-safe ID. The label uses `for`, messages receive stable IDs, and slot attributes include `aria-describedby` and `aria-invalid`. Consumers must bind the supplied control attributes, as shown above. Validation execution remains consumer-owned.

## UiFieldMessage

```vue
<UiFieldMessage variant="warning" message="This value will be reviewed" />
```

Props: `id`, `message`, `variant` (`hint`, `error`, `success`, or `warning`), `icon`, and `hideIcon`. There are no emits. Slots are `default` and `icon`; the icon slot receives the resolved semantic icon. Error messages use `role="alert"`; warning and success updates use polite announcements. Set `hide-icon` to hide the icon.

## UiFormActions

```vue
<form @submit.prevent="save">
  <UiFormActions :loading="saving" @submit="save" @cancel="cancel">
    <template #secondary><a href="/help">Help</a></template>
  </UiFormActions>
</form>
```

Props: `submitLabel`, `cancelLabel`, `loading`, `disabled`, `cancelDisabled`, `showCancel`, `align`, `sticky`, and `direction`. Emits are `submit` and `cancel`. Slots are `default` and `secondary`; the default slot receives `submit`, `cancel`, `loading`, and `disabled`.

The submit control has native `type="submit"`; cancel has `type="button"`. Loading disables both defaults and exposes `aria-busy`. Default labels come from the UI Kit message catalog and icons from the semantic icon registry.

## Locale, direction, and provider fallback

Direct imports default to Persian and RTL. Plugin configuration provides English/LTR, message overrides, and icon overrides. Explicit `direction` props take precedence. Styling uses public `--ui-*` semantic tokens and logical CSS properties.

## Known limitations and adoption

- These components do not integrate with VeeValidate, Yup, Zod, or native constraint-validation logic.
- `UiField` cannot apply accessibility attributes to a slotted control automatically; bind its slot properties.
- Sticky actions require an appropriate consumer scroll container.
- Existing consumer forms can adopt the family incrementally, beginning with duplicated submit/cancel rows and fields needing externally rendered messages.
