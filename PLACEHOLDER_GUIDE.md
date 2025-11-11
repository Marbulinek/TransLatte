# Placeholder & Interpolation Support

## Overview

TransLatté automatically preserves placeholder variables and interpolation syntax in your translations. This is essential for dynamic content that gets replaced at runtime in your Angular applications.

## Supported Placeholder Formats

By default, TransLatté recognizes and preserves these placeholder formats:

| Format | Example | Common Use |
|--------|---------|------------|
| `{{variable}}` | `Hello {{name}}!` | Angular interpolation, Handlebars |
| `{variable}` | `Welcome {user}` | ICU MessageFormat, i18next |
| `%variable%` | `Save %discount% today` | Custom format |
| `$variable$` | `Price: $amount$` | Custom format |
| `${variable}` | `User ${id} logged in` | Template literals style |

## How It Works

1. **Before Translation**: Placeholders are extracted and replaced with temporary tokens
2. **During Translation**: Only the actual text is sent to the translation API
3. **After Translation**: Original placeholders are restored in their exact format

### Example:

**Input (English):**
```json
{
  "WELCOME": "Hello {{name}}, you have {count} new messages"
}
```

**Output (Spanish):**
```json
{
  "WELCOME": "Hola {{name}}, tienes {count} mensajes nuevos"
}
```

✅ **Placeholders preserved exactly as they were!**

## Configuration

### Basic Configuration (Automatic)

By default, placeholder preservation is **enabled** and works automatically:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"]
}
```

### Advanced Configuration

You can customize the behavior:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
  "preserveInterpolation": true,
  "interpolationPattern": "\\{\\{[^}]+\\}\\}|\\{[^}]+\\}|%[^%]+%"
}
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `preserveInterpolation` | boolean | `true` | Enable/disable placeholder preservation |
| `interpolationPattern` | string | See below | Custom regex pattern for placeholders |

#### Default Pattern

```javascript
"\\{\\{[^}]+\\}\\}|\\{[^}]+\\}|%[^%]+%|\\$[^$]+\\$|\\$\\{[^}]+\\}"
```

This matches:
- `{{anything}}`
- `{anything}`
- `%anything%`
- `$anything$`
- `${anything}`

### Custom Patterns

If you use different placeholder formats, you can define your own regex pattern:

#### Example 1: Only Angular-style placeholders
```json
{
  "interpolationPattern": "\\{\\{[^}]+\\}\\}"
}
```

#### Example 2: Square brackets
```json
{
  "interpolationPattern": "\\[\\[[^\\]]+\\]\\]"
}
```
Matches: `[[variable]]`

#### Example 3: Multiple custom formats
```json
{
  "interpolationPattern": "\\{\\{[^}]+\\}\\}|\\[\\[[^\\]]+\\]\\]|@[a-zA-Z0-9_]+"
}
```
Matches: `{{var}}`, `[[var]]`, `@var`

## Real-World Examples

### Example 1: Angular Application

**en.json:**
```json
{
  "USER": {
    "GREETING": "Welcome back, {{firstName}} {{lastName}}!",
    "STATS": "You have {{unreadCount}} unread messages",
    "LAST_LOGIN": "Last login: {{lastLoginDate}}"
  },
  "CART": {
    "TOTAL": "Total: {{currency}}{{amount}}",
    "ITEMS": "{{itemCount}} item(s) in cart",
    "DISCOUNT": "Save {{discountPercent}}% today!"
  }
}
```

**Generated es.json:**
```json
{
  "USER": {
    "GREETING": "Bienvenido de nuevo, {{firstName}} {{lastName}}!",
    "STATS": "Tienes {{unreadCount}} mensajes no leídos",
    "LAST_LOGIN": "Último inicio de sesión: {{lastLoginDate}}"
  },
  "CART": {
    "TOTAL": "Total: {{currency}}{{amount}}",
    "ITEMS": "{{itemCount}} artículo(s) en el carrito",
    "DISCOUNT": "¡Ahorra {{discountPercent}}% hoy!"
  }
}
```

### Example 2: ICU MessageFormat

**en.json:**
```json
{
  "MESSAGES": {
    "INBOX": "{count, plural, =0{No messages} =1{One message} other{# messages}}",
    "SELECTED": "{count, plural, =0{None selected} other{# selected}}"
  }
}
```

**Configuration:**
```json
{
  "preserveInterpolation": true,
  "interpolationPattern": "\\{[^}]+\\}"
}
```

### Example 3: i18next

**en.json:**
```json
{
  "WELCOME": "Hello, {name}!",
  "DATE": "Today is {date, date}",
  "NUMBER": "You have {count, number} points"
}
```

All placeholder formats are preserved automatically!

## Usage in Angular

### With ngx-translate

```typescript
// In component
constructor(private translate: TranslateService) {}

showWelcome(userName: string) {
  this.translate.get('WELCOME', { name: userName }).subscribe((text: string) => {
    console.log(text); // "Hello, John!" (in English)
                       // "Hola, John!" (in Spanish)
  });
}
```

### In Template

```html
<!-- Using interpolation -->
<p>{{ 'USER.GREETING' | translate: { firstName: user.firstName, lastName: user.lastName } }}</p>

<!-- Using pipes -->
<p>{{ 'CART.TOTAL' | translate: { currency: '$', amount: 99.99 } }}</p>
```

## Disabling Placeholder Preservation

If you need to disable this feature (not recommended):

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es"],
  "preserveInterpolation": false
}
```

⚠️ **Warning**: Disabling will cause placeholders to be translated, breaking your application!

## Best Practices

### ✅ Do:
- Use consistent placeholder formats across your app
- Keep placeholder names descriptive (`{{userName}}` not `{{u}}`)
- Test translations with real data to ensure placeholders work

### ❌ Don't:
- Mix too many different placeholder formats
- Use special characters in placeholder names
- Nest placeholders (`{{outer{{inner}}}}`)

## Troubleshooting

### Problem: Placeholders are being translated

**Solution**: Check that `preserveInterpolation` is set to `true` (or not set, as it defaults to `true`)

### Problem: Custom placeholder format not recognized

**Solution**: Define a custom `interpolationPattern` that matches your format:

```json
{
  "interpolationPattern": "your-regex-pattern-here"
}
```

### Problem: Spaces around placeholders removed

**Solution**: This is fixed in v1.1.0+. Update to the latest version:

```bash
npm install @marbulinek/translatte@latest
```

## Testing Placeholder Preservation

Create a test file with various placeholder formats:

**test-placeholders.json:**
```json
{
  "TEST": {
    "ANGULAR": "Hello {{name}}",
    "ICU": "You have {count} items",
    "PERCENT": "Save %discount% today",
    "DOLLAR": "User $id$ logged in",
    "TEMPLATE": "Welcome ${user}"
  }
}
```

Run translation:
```bash
translatte generate --source en --targets es --input test-placeholders.json --output ./
```

Verify all placeholders are preserved in the output!

## Examples with Context

### E-commerce Application

```json
{
  "PRODUCT": {
    "PRICE": "Price: {{currency}}{{amount}}",
    "DISCOUNT": "Save {{discountPercent}}% - was {{originalPrice}}, now {{salePrice}}",
    "STOCK": "{stockCount, plural, =0{Out of stock} =1{Only 1 left} other{# in stock}}"
  },
  "CHECKOUT": {
    "TOTAL": "Total: {{currency}}{{subtotal}} + {{tax}} tax = {{total}}",
    "SHIPPING": "Ships to {{address}} in {deliveryDays} days"
  }
}
```

### Social Media Application

```json
{
  "NOTIFICATIONS": {
    "LIKE": "{{userName}} liked your post",
    "COMMENT": "{{userName}} commented: {{commentPreview}}",
    "FOLLOW": "{{userName}} and {otherCount} others followed you",
    "MESSAGE": "New message from {{senderName}}: {messagePreview}"
  }
}
```

### Dashboard Application

```json
{
  "STATS": {
    "USERS": "{{activeUsers}} active users ({{percentChange}}% vs last week)",
    "REVENUE": "Revenue: {{currency}}{{amount}} ({{trend}})",
    "GROWTH": "Growth rate: {{rate}}% over {period}"
  }
}
```

## Summary

✅ Placeholder preservation is **automatic** and **enabled by default**
✅ Supports common formats: `{{}}`, `{}`, `%%`, `$$`, `${}`
✅ Customizable with `interpolationPattern`
✅ Works seamlessly with Angular, i18next, ICU MessageFormat
✅ No configuration needed for standard use cases

---

Your translations are safe! TransLatté ensures your dynamic content remains functional across all languages. ☕
