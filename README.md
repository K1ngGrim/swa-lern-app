# LernApp - Dokumentation

Diese Dokumentation beschreibt die Architektur, den Entwurf und die Implementierung der LernApp, einer webbasierten Anwendung zum Lernen mit Karteikarten basierend auf dem Spaced Repetition Prinzip.

## Inhaltsverzeichnis
1. [Einleitung](#1-einleitung)
2. [Grundlagen](#2-grundlagen)
3. [Umsetzung / Implementierung](#3-umsetzung--implementierung)
4. [Deployment & Datenhaltung](#4-deployment--datenhaltung)
5. [Fazit](#5-fazit)
6. [Anhang: How to Run](#anhang-how-to-run)

---

## 1. Einleitung

### Motivation
Physische Karteikarten sind oft mühsam zu transportieren, schwer zu organisieren und nicht mehr zeitgemäß. Studierende stehen häufig vor dem Problem, dass klassische Lernmethoden (wie das wiederholte Lesen von Skripten) nur zu kurzfristigem Erfolg führen ("Bulimielernen"). Digitale Lösungen bieten hier enorme Vorteile durch Algorithmen, die den Lernprozess optimieren.

### Zielsetzung
Ziel dieses Projekts war die Entwicklung einer modernen, webbasierten Lernkarten-App ("LernApp"). Der Fokus lag dabei auf:
* Einer sauberen **Software-Architektur** mit klarer Trennung von Frontend und Backend.
* Der Implementierung eines **Spaced Repetition Algorithmus** zur Steigerung der Lerneffizienz.
* Einer intuitiven Benutzeroberfläche zur Verwaltung von Decks und Karten.

---

## 2. Grundlagen

### Detaillierte Problemstellung
Das menschliche Gehirn vergisst Informationen exponentiell (Vergessenskurve nach Ebbinghaus). Um Informationen langfristig zu speichern, müssen sie in optimalen Abständen wiederholt werden. Die LernApp adressiert genau dieses Problem, indem sie dem Nutzer Karten genau dann wieder vorlegt, bevor er sie zu vergessen droht.

### Technologieauswahl & Begründung

Die Anwendung ist in zwei Hauptbereiche unterteilt: **Frontend** und **Backend**.

| Bereich | Technologie | Begründung |
|---------|-------------|------------|
| **Backend** | **.NET 8 (ASP.NET Core)** | Aktuelles Long-Term-Support (LTS) Framework von Microsoft. Bietet hohe Performance, Typsicherheit (C#) und mit **Entity Framework Core** ein mächtiges ORM für Datenbankzugriffe. Die **Web API** Architektur ermöglicht eine saubere REST-Schnittstelle. |
| **Frontend** | **Angular 20** | Modernes, komponenten-basiertes Framework. Die statische Typisierung durch TypeScript und die strikte Struktur (Standalone Components) fördern die Wartbarkeit. Nutzung von **Angular Material** für ein konsistentes UI-Design. |
| **Datenbank** | **PostgreSQL** | Leistungsfähiges, relationales Open-Source-Datenbanksystem. Ideal für strukturierte Daten (User, Decks, Cards) und komplexe Abfragen. Läuft isoliert im Docker-Container. |
| **API Client** | **OpenAPI Generator** | Automatische Generierung des Frontend-Codes (Services, Models) basierend auf der Swagger-Spezifikation des Backends. Verhindert Diskrepanzen zwischen Client und Server. |
| **Auth** | **ASP.NET Identity** | Etablierter Standard für Benutzerverwaltung. Nutzung von **Cookie-Authentication** (HttpOnly) für erhöhte Sicherheit im Vergleich zu LocalStorage-JWTs. |

### Use Cases
Die zentralen Anwendungsfälle sind:
1. **Benutzerkonto**: Registrierung und Login.
2. **Verwaltung**: Erstellen und Löschen von Decks und Karten.
3. **Lernen**: Starten einer Lernsession, bei der fällige Karten angezeigt werden.
4. **Bewertung**: Der Nutzer bewertet seine Antwort (*Again, Hard, Good, Easy*), was den Algorithmus beeinflusst.

### Muss-/Kann-Kriterien
* **Muss**: Karten erstellen, Decks verwalten, Lernlogik (Algorithmus), Persistenz in Datenbank, REST-Schnittstelle.
* **Kann**: Benutzerverwaltung (wurde implementiert!), Statistik-Ansicht (Grundgerüst vorhanden), Import/Export.

---

## 3. Umsetzung / Implementierung

Die Architektur folgt dem **MVC (Model-View-Controller)** Pattern, verteilt auf Client und Server.

### Backend (.NET 8)
Das Backend stellt die Geschäftslogik und Datenhaltung bereit.
* **Controller Layer**: REST-Endpoints (z.B. `CardController`, `DeckController`, `IdentityController`). Sie nehmen Requests entgegen und validieren diese.
* **Service Layer**: Enthält die eigentliche Logik.
    * `DeckService` / `CardService`: CRUD-Operationen.
    * `LearningService`: Implementiert den **Spaced Repetition Algorithmus**.
        * **Zustände**: Eine Karte besitzt einen von vier Zuständen: `New`, `Learning`, `Review`, `Relearning`.
        * **Logik**: Wenn ein Nutzer eine Karte bewertet (*Again*, *Hard*, *Good*, *Easy*), wird basierend auf dem aktuellen Zustand und dem Rating das nächste Fälligkeitsdatum (`DueDate`) und das Intervall (`Interval`) berechnet.
            * *Beispiel*: Eine Karte im Status `New`, die mit *Good* bewertet wird, springt in den Status `Learning` und wird in 15 Minuten erneut vorgelegt. Eine Karte im Status `Review`, die mit *Easy* bewertet wird, vervielfacht ihr Intervall (Faktor 3) und wird erst in `n * 3` Tagen wieder fällig.
        * **Sonderfälle**: Wenn eine Karte mit *Again* (kleinste Stufe) bewertet wird, wird ihr Fälligkeitsdatum sofort auf `jetzt` (oder `jetzt + 1 Minute` im Review-Modus) gesetzt.
            * *Konsequenz*: Ist die Lernsession noch aktiv (d.h. der Nutzer lernt gerade), wird diese Karte **sofort** oder sehr zeitnah wieder angezeigt, sobald die aktuelle Liste der fälligen Karten neu geladen oder abgearbeitet wird. Es gibt keine "Wartebank" für Karten, die man gerade nicht wusste – sie müssen wiederholt werden, bis sie sitzen.

* **Data Access Layer**: `CoreContext` (Entity Framework Core) managed den Zugriff auf die PostgreSQL Datenbank.
    * Die Datenbank ist in zwei Schemas unterteilt: `identity` (User, Rollen) und `core` (Decks, Karten, Lernfortschritt).

### Authentifizierung & Sicherheit
Das Sicherheitskonzept basiert auf **ASP.NET Core Identity**.
* **Verfahren**: Es wird **Cookie-Authentication** verwendet anstelle von JWT Tokens. Dies erhöht die Sicherheit vor XSS-Angriffen, da das Authentifizierungs-Cookie als `HttpOnly` markiert ist und somit nicht per JavaScript ausgelesen werden kann.
* **Ablauf**:
    1. Der Client sendet Login-Daten an `/api/identity/login`.
    2. Bei Erfolg setzt der Server ein verschlüsseltes `Identity.Application` Cookie.
    3. Browser sendet dieses Cookie automatisch bei jedem weiteren Request mit.
    4. Das Backend validiert das Cookie via Middleware und setzt den `User` Principal im Controller-Kontext (`HttpContext.User`).
* **Konfiguration**: Die API fängt den Standard-Redirect bei "Nicht-Authentifiziert" (HTTP 302 auf Login-Seite) ab und sendet stattdessen den korrekten Statuscode **401 Unauthorized**. Damit kann das Angular-Frontend (insb. der `AuthGuard` und Interceptor) korrekt reagieren und den Nutzer zur Login-Seite leiten.


### Frontend (Angular 20)
Das Frontend ist als Single Page Application (SPA) realisiert.
* **Struktur**: Nutzung von **Standalone Components** (modernster Angular Standard ohne NgModules).
    * `Pages`: `Home`, `DeckPage`, `CreateNewDeckPage`, `LoginPage`.
* **Kommunikation**: `AuthService` managed den Login-Status. Die Kommunikation zum Backend erfolgt über Services (`DeckService`, `CardService`), die automatisch aus der OpenAPI-Spezifikation generiert wurden.
* **Internationalisierung**: Einsatz von `@ngx-translate` zur Unterstützung mehrerer Sprachen (DE/EN).

### Datenbank-Design
Das ER-Modell wurde relational umgesetzt:
* Ein `User` hat `n` Decks.
* Ein `Deck` hat `n` Cards.
* Eine `Card` speichert ihren eigenen Lernfortschritt (`State`, `Interval`, `DueDate`).

---

## 4. Deployment & Datenhaltung

### Aktueller Stand
Das System wird aktuell mittels **Docker Compose** betrieben, was eine einfache Inbetriebnahme der Backend-Komponenten ermöglicht.

* **Containerisierung**:
    * **Backend (API)**: Läuft in einem Docker-Container basierend auf dem .NET 8 SDK/Runtime Image. Es wird zur Laufzeit via Docker Build gebaut.
    * **Datenbank**: Ein offizieller PostgreSQL Container (`postgres:latest`).

### Datenpersistenz
**WICHTIG**: Im aktuellen Entwicklungsstadium (Prototyp) sind **keine Docker Volumes** konfiguriert.
* **Datenspeicherung**: Die Daten liegen ausschließlich im flüchtigen Dateisystem des PostgreSQL-Containers (`/var/lib/postgresql/data`).
* **Konsequenz**: Solange die Container laufen oder nur gestoppt (`docker stop`) werden, bleiben die Daten erhalten. Werden die Container jedoch entfernt (`docker compose down`), **gehen alle Daten (User, Decks, Lernfortschritt) unwiderruflich verloren**.
* **Ausblick**: Für einen produktiven Betrieb muss ein Volume-Mapping (z.B. `- ./data:/var/lib/postgresql/data`) in der `docker-compose.yml` ergänzt werden, um die Daten auf dem Host-System dauerhaft zu persistieren.

---

## 5. Fazit

Das Projekt **LernApp** konnte erfolgreich umgesetzt werden. Die zentralen Anforderungen (Muss-Kriterien) wurden vollständig erfüllt. Durch den Einsatz moderner Technologien (.NET 8, Angular 20) und Werkzeuge (Docker, OpenAPI Generator) entstand eine stabile und wartbare Anwendung.

Besonders hervorzuheben ist die Implementierung der Benutzerverwaltung (ursprünglich ein Kann-Kriterium) sowie der funktionierende Spaced Repetition Algorithmus im Backend. Die klare Trennung der Verantwortlichkeiten ermöglicht eine einfache Erweiterung der App in der Zukunft (z.B. um detailliertere Statistiken oder mobile Apps).

---

## Anhang: How to Run

### Voraussetzungen
* Docker & Docker Compose installiert.

### Starten der Anwendung
1. Repository klonen.
2. Im Root-Verzeichnis ausführen:
   ```bash
   docker compose -f docker/docker-compose.yml up -d --build
   ```
3. **Frontend**: Erreichbar unter `http://localhost:4200`
4. **Backend API**: Erreichbar unter `http://localhost:5001` (Swagger UI unter `/swagger`)

### Lokale Entwicklung
* **Backend**: `LernApp-Backend.sln` öffnen. `appsettings.json` anpassen (Connection String).
* **Frontend**: `npm install` und `ng serve` im `Frontend/LernApp` Ordner ausführen.

