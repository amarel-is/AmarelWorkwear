# עדכון צבעים - Amarel Branding

## שינויים שבוצעו:

### ✅ צבע ראשי חדש: #17222D

הצבע הכחול הקודם (#0071e3) הוחלף בצבע הברנד של Amarel (#17222D) בכל הפרויקט.

### קבצים שעודכנו:

1. **src/index.css**
   - `--primary-color: #17222D`
   - `--primary-hover: #2a3847` (צבע hover חדש)
   - `--accent-color: #17222D`

2. **src/components/Login.css**
   - רקע גרדיאנט: `linear-gradient(135deg, #17222D 0%, #2a3847 100%)`
   - כפתור hover: `var(--primary-hover)`

3. **src/components/Catalog.css**
   - כפתור "הוסף לסל" hover: `var(--primary-hover)`

4. **src/components/Cart.css**
   - כל כפתורי hover: `var(--primary-hover)`

5. **src/components/Checkout.css**
   - כל כפתורי hover: `var(--primary-hover)`

### איך זה נראה:

- **כפתורים ראשיים**: רקע #17222D (כחול-שחור כהה)
- **כפתורים hover**: רקע #2a3847 (מעט יותר בהיר)
- **קטגוריות פעילות**: רקע #17222D
- **רקע התחברות**: גרדיאנט מ-#17222D ל-#2a3847

### להרצה:

```bash
npm run dev
```

זה יפעיל את השרת עם הצבעים המעודכנים של Amarel!
