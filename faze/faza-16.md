# Faza 16 — Accessibility i UX polish

## Opis
Accessibility audit i UX detalji. React Native ima drugacije accessibility API od HTML
(nema `aria-*` atribute — koriste se `accessible`, `accessibilityLabel`,
`accessibilityRole`, `accessibilityState`, `accessibilityHint`).

## Zavisnosti
Sve prethodne faze

## Web referenca
```
Nema direktnog web ekvivalenta — web koristi HTML semantiku i ARIA atribute.
Mobilni pristup se zasniva na React Native Accessibility API.
```

---

## React Native Accessibility API

### Mapiranje HTML → RN atributa

| HTML/ARIA | React Native |
|-----------|-------------|
| `role="button"` | `accessibilityRole="button"` |
| `role="link"` | `accessibilityRole="link"` |
| `role="img"` | `accessibilityRole="image"` |
| `aria-label="..."` | `accessibilityLabel="..."` |
| `aria-hint="..."` | `accessibilityHint="..."` |
| `aria-disabled={true}` | `accessibilityState={{ disabled: true }}` |
| `aria-checked={true}` | `accessibilityState={{ checked: true }}` |
| `aria-selected={true}` | `accessibilityState={{ selected: true }}` |
| `aria-live="polite"` | `accessibilityLiveRegion="polite"` |
| `aria-hidden={true}` | `importantForAccessibility="no-hide-descendants"` |
| `tabIndex={-1}` | `accessible={false}` |

### Grupisanje elemenata

```tsx
// Grupisati karticu kao jedan accessible element
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`${srpski_naziv}, ${latinski_naziv}`}
>
  {/* Deca nisu dostupna screen readeru zasebno */}
</Pressable>
```

---

## Kljucni elementi za accessibility audit

### 1. BiljkaKartica

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel={`${srpski_naziv}, ${latinski_naziv}${porodica ? `, ${porodica}` : ''}`}
  accessibilityHint="Otvara detalje biljke"
>
```

OmiljenaToggle unutar kartice — mora biti odvojen accessible element.
`stopPropagation` ne postoji na React Native `GestureResponderEvent` — koristiti
`onStartShouldSetResponder` da zaustavi propagaciju na parent Pressable:

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel={je_omiljena ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
  onStartShouldSetResponder={() => true}   // zaustavlja propagaciju ka parent Pressable
  onPress={() => onOmiljenaToggle(id, slug)}
/>
```

Alternativno (jednostavnije): `hitSlop` na toggle + `onPress` sa `event` argumentom
koji RN sam ispravno routuje kada su Pressable-ovi ugnjezdeni jedan u drugome.

### 2. Organ chipovi (Prepoznavanje)

```tsx
<Pressable
  accessibilityRole="radio"
  accessibilityState={{ checked: organ === vrednost }}
  accessibilityLabel={label}
>
```

### 3. Filter chipovi (Pretraga)

```tsx
<Pressable
  accessibilityRole="checkbox"
  accessibilityState={{ checked: aktivni_filter === tag.filter }}
  accessibilityLabel={tag.label.sr}
>
```

### 4. Image accessibility

```tsx
<Image
  accessibilityRole="image"
  accessibilityLabel={alt_tekst || srpski_naziv}
/>
```

Dekorativne slike (pozadina):
```tsx
<Image importantForAccessibility="no" />
```

### 5. TextInput labels

```tsx
// Svaki TextInput mora imati label ili accessibilityLabel
<Text nativeID="email-label">Email</Text>
<TextInput accessibilityLabelledBy="email-label" />
// ILI jednostavnije:
<TextInput accessibilityLabel="Email adresa" />
```

---

## UX detalji

### Keyboard avoidance

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  className="flex-1"
>
  <ScrollView keyboardShouldPersistTaps="handled">
    {/* Forma sadrzaj */}
  </ScrollView>
</KeyboardAvoidingView>
```

Koristiti na auth ekranima (prijava, registracija) i svuda gde postoji TextInput.

### Pressable feedback

```tsx
// Dodati vizuelni feedback na sve Pressable-ove:
<Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
```

Alternativa sa NativeWind (nije podrzano direktno — koristiti `style` prop).

### ScrollView za forme

Sve forme (auth ekrani) moraju imati `ScrollView` sa `keyboardShouldPersistTaps="handled"`
da klik na dugme radi i kada je tastatura otvorena.

### Loading dugmadi

Kada je `isPending === true`:
- `disabled` prop na Pressable
- `opacity: 0.5` ili `disabled:opacity-50` (NativeWind)
- Prikazati `ActivityIndicator` umesto teksta

---

## Performanse lista

### FlashList vs FlatList

`FlashList` zahteva `estimatedItemSize`. Proveriti da li je vrednost realna:
- BiljkaKartica u 2 kolone: `estimatedItemSize={220}`
- NedavnoPregledano horizontalni item: `estimatedItemSize={96}`

### Memoizacija

```tsx
import { memo } from 'react';

// BiljkaKartica — memoizovati da se ne re-renderuje pri scroll-u
export const BiljkaKartica = memo(function BiljkaKartica({ ... }) {
  // ...
});
```

---

## Sta izostaviti
- `focus-visible` klase — ne postoji hover/focus na mobilnom
- `tabIndex` kontrola — RN upravljenje fokusom je drugacije
- Keyboard shortcuts — ne postoje na mobilnom (vec navedeno u Fazi 9)

## Commit
`fix: accessibility — accessibilityLabel i role na svim interaktivnim elementima`

## Proveri pre commita
- [ ] VoiceOver (iOS) / TalkBack (Android): sve interaktivne komponente imaju accessibilityLabel
- [ ] Kartice na listama grupisane kao jedan element (ne cita se svako dijete zasebno)
- [ ] Organ chipovi i filter chipovi imaju accessibilityRole="radio"/"checkbox"
- [ ] Slike imaju alt tekst kroz accessibilityLabel
- [ ] Auth forme: KeyboardAvoidingView sprečava da tastatura pokrije dugme
- [ ] keyboardShouldPersistTaps="handled" na svim ScrollView-ovima sa formama
- [ ] Disabled dugmad imaju opacity promenu i ne reaguju na tap
- [ ] Loading stanje: ActivityIndicator umesto teksta, dugme disabled
- [ ] BiljkaKartica: tap na srce ne otvara i detalje biljke istovremeno
