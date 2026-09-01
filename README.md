# 🎵 Nuta

**Nuta** to aplikacja webowa, która zmienia sposób, w jaki DJ wchodzi w interakcję z publicznością. Goście imprezy skanują kod QR i ze swojego telefonu mogą zamawiać utwory, głosować na kolejkę, wykupić priorytet (VIP) lub zostawić DJ-owi napiwek — wszystko w czasie rzeczywistym, bez pobierania żadnej aplikacji.

🔗 **Live:** [nuta.app](https://www.nuta.app)

---

## 📖 O projekcie

Na klasycznej imprezie DJ nie ma żadnego prostego sposobu, by dowiedzieć się czego chcą słuchać goście — poza krzykiem przez tłum albo karteczką przy konsolecie. Nuta rozwiązuje ten problem, dając gościom narzędzie do realnego wpływania na przebieg imprezy, a DJ-owi — dodatkowe źródło przychodu (VIP, napiwki) i pełną kontrolę nad tym, co faktycznie trafia do seta.

**Dla gościa:**
- Wyszukuje utwór (integracja ze Spotify) i zamawia go za darmo lub jako VIP (priorytet w kolejce)
- Głosuje na utwory innych, żeby przesunęły się wyżej
- Widzi status swoich zamówień na żywo
- Może zostawić DJ-owi napiwek

**Dla DJ-a:**
- Panel na żywo z pełną kolejką, statystykami i utargiem
- Pełna kontrola — akceptuje lub odrzuca każdy utwór (z automatycznym zwrotem pieniędzy przy odrzuceniu)
- Konfiguracja "w locie": cena VIP, pasek ogłoszeń, tryb aplikacji, czego nie gra

Projekt powstał jako narzędzie do własnej pracy DJ-skiej i przeszedł pierwszy test na żywej imprezie studenckiej.

### Czym się wyróżnia
- Działa na **dowolnym telefonie i dowolnym sprzęcie DJ-skim** — brak wymagań co do konsolety
- Realny **model przychodowy** (VIP + napiwki), nie tylko głosowanie
- **Otwarte zamawianie** — gość szuka i zamawia dowolny utwór dostępny na Spotify, a nie tylko z góry przygotowanej listy

---

## 🛠️ Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | React (Vite) |
| Baza danych + realtime | Supabase (PostgreSQL) |
| Logika serwerowa | Supabase Edge Functions (Deno) |
| Płatności | Stripe (karty, BLIK) |
| Dane muzyczne | Spotify Web API, GetSongBPM |
| Hosting | Vercel |

### Architektura w skrócie
- **Frontend** komunikuje się z Supabase bezpośrednio (odczyt/zapis danych) oraz przez **Edge Functions** dla operacji wymagających sekretów (płatności Stripe, zapytania do Spotify/GetSongBPM)
- **Realtime** (Supabase Realtime) odpowiada za natychmiastową synchronizację kolejki, statusu VIP i konfiguracji między wszystkimi urządzeniami — gośćmi i DJ-em
- **Rate limiting** (limit zamówień, limit głosów) jest egzekwowany po stronie bazy danych (funkcje SQL + RLS), nie tylko na froncie — nie da się go obejść z poziomu przeglądarki
- Każdy gość ma losowy, trwały identyfikator w `localStorage`, dzięki czemu może otrzymywać **spersonalizowane powiadomienia** (np. o odrzuceniu jego VIP-a) bez systemu kont

### Uruchomienie lokalne

```bash
npm install
cp .env.example .env.local   # uzupełnij własnymi kluczami Supabase
npm run dev
```

Wymaga skonfigurowanego projektu Supabase (schemat bazy + Edge Functions + sekrety: Stripe, Spotify, GetSongBPM).

---

## 🗺️ Roadmapa

**Zrobione:**
- ✅ Zamawianie utworów (darmowe + VIP) z wyszukiwarką Spotify
- ✅ Głosowanie z limitem i licznikiem czasu do resetu
- ✅ Płatności VIP i napiwki (Stripe)
- ✅ Panel DJ z live statystykami i pełną konfiguracją
- ✅ Rate limiting serwerowy odporny na obejście
- ✅ Spersonalizowane powiadomienia (status zamówienia, decyzja DJ-a)
- ✅ Własny branding i domena

**W planach:**
- 🔲 Walidacja rynkowa — testy z innymi DJ-ami i lokalami
- 🔲 Konta DJ-ów (multi-tenant) — jedna instalacja, wielu użytkowników
- 🔲 Model płatności split (Stripe Connect) — automatyczny podział przychodu DJ / platforma
- 🔲 Panel statystyk historycznych między imprezami
- 🔲 Zamknięta pula utworów definiowana przez DJ-a (opcjonalna, obok otwartego zamawiania) — eliminacja odrzuceń przy VIP

---

## 📄 Licencja

Projekt prywatny — wszelkie prawa zastrzeżone.
