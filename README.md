
# LernApp - Dokumentation

Diese Dokumentation beschreibt die Architektur, den Entwurf und die Implementierung der LernApp, einer webbasierten Anwendung zum Lernen mit Karteikarten basierend auf dem Spaced Repetition Prinzip.

## Inhaltsverzeichnis
1. [Einleitung](#1-einleitung)
2. [Grundlagen](#2-grundlagen)
3. [Software-Architektur](#3-software-architektur)
4. [Implementierung](#4-implementierung)
5. [Deployment & Datenhaltung](#5-deployment--datenhaltung)
6. [Fazit](#6-fazit)
7. [Anhang: How to Run](#anhang-how-to-run)

---

## 1. Einleitung

### Motivation
Physische Karteikarten sind oft mühsam zu transportieren, schwer zu organisieren und nicht mehr zeitgemäß. Studierende stehen häufig vor dem Problem, dass klassische Lernmethoden, wie das wiederholte Lesen von Skripten, nur zu kurzfristigem Erfolg führen. Digitale Lösungen bieten hier enorme Vorteile durch Algorithmen, die den Lernprozess optimieren.

### Zielsetzung
Ziel dieses Projekts war die Entwicklung einer webbasierten Lernkarten-App unter dem Namen "LernApp". Der Fokus der Entwicklung lag dabei auf einer sauberen **Software-Architektur**, die unter klarer Trennung von Frontend und Backend implementiert wurde. Ein weiteres Kernziel war die Implementierung eines **Spaced Repetition Algorithmus**, um die Lerneffizienz der Nutzer signifikant zu steigern.
Für den Nutzer soll eine ansprechende und intuitiv bedienbare Benutzeroberfläche geschaffen werden, welcher die Verwaltung der Lerninhalte so einfach wie möglich gestaltet.

---

## 2. Grundlagen

### Detaillierte Problemstellung
Das menschliche Gehirn vergisst Informationen exponentiell. Um Informationen langfristig zu speichern, müssen sie in optimalen Abständen wiederholt werden. Die LernApp adressiert genau dieses Problem, indem sie dem Nutzer Karten genau dann wieder vorlegt, bevor er sie zu vergessen droht.

### Technologieauswahl & Begründung

Die Anwendung ist in zwei Hauptbereiche unterteilt: **Frontend** und **Backend**.

| Bereich        | Technologie               | Begründung                                                                                                                                                                                                                                                |
|----------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Backend**    | **.NET 8 (ASP.NET Core)** | Aktuelles Long-Term-Support (LTS) Framework von Microsoft. Bietet hohe Performance, Typsicherheit (C#) und mit **Entity Framework Core** ein mächtiges ORM für Datenbankzugriffe. Die **Web API** Architektur ermöglicht eine saubere REST-Schnittstelle. |
| **Frontend**   | **Angular 20**            | Modernes, komponenten-basiertes Framework. Die statische Typisierung durch TypeScript und die strikte Struktur (Standalone Components) fördern die Wartbarkeit. Nutzung von **Angular Material** für ein konsistentes UI-Design.                          |
| **Datenbank**  | **PostgreSQL**            | Leistungsfähiges, relationales Open-Source-Datenbanksystem. Ideal für strukturierte Daten (User, Decks, Cards) und komplexe Abfragen. Läuft isoliert im Docker-Container.                                                                                 |
| **API Client** | **OpenAPI Generator**     | Automatische Generierung des Frontend-Codes (Services, Models) basierend auf der Swagger-Spezifikation des Backends. Verhindert Diskrepanzen zwischen Client und Server.                                                                                  |
| **Auth**       | **ASP.NET Identity**      | Etablierter Standard für Benutzerverwaltung. Nutzung von **Cookie-Authentication** (HttpOnly) für erhöhte Sicherheit im Vergleich zu LocalStorage-JWTs.                                                                                                   |

## Use Cases

**Benutzerkonto**

* Benutzer öffnet die App und navigiert zur Registrierungsseite
* Gibt E-Mail und Passwort ein und erstellt ein neues Konto
* Benutzer meldet sich über die Login-Seite an
* Session wird serverseitig über Cookies (HttpOnly) verwaltet
* Benutzer bleibt über mehrere Requests hinweg authentifiziert

**Deck erstellen**

* Benutzer navigiert zur Deck-Übersicht
* Klickt auf „Neues Deck erstellen“
* Gibt einen Namen für das Deck ein
* Deck wird dem Benutzer zugeordnet und im Backend gespeichert

**Deck bearbeiten**

* Benutzer öffnet ein bestehendes Deck
* Kann den Namen ändern
* Änderungen werden persistent in der Datenbank gespeichert

**Karte hinzufügen**

* Benutzer öffnet ein Deck und klickt auf „Karte hinzufügen“
* Formular erscheint mit Eingabefeldern für Frage und Antwort (optional Tags)
* Karte wird gespeichert und dem Deck zugeordnet

**Karte bearbeiten**

* Benutzer öffnet eine Karte innerhalb eines Decks
* Klickt auf Bearbeiten
* Formular mit bestehenden Inhalten öffnet sich
* Änderungen werden gespeichert

**Karte löschen**

* Benutzer löscht eine Karte aus einem Deck
* Bestätigungsdialog erscheint
* Karte wird nach Bestätigung entfernt

**Lern-Session starten**

* Benutzer wählt ein Deck aus
* Klickt auf „Lernen“
* System lädt algorithmisch ausgewählte, fällige Karten (Spaced Repetition)
* Frage wird angezeigt, Antwort kann aufgedeckt werden

**Antwort bewerten**

* Benutzer bewertet seine Antwort mit

    * Again
    * Hard
    * Good
    * Easy
* System berechnet das nächste Wiederholungsintervall
* Kartenstatus und Fälligkeitsdatum werden aktualisiert

---

## User Stories

**Benutzerkonto**

* Als neuer Nutzer möchte ich mich registrieren und anmelden können, damit meine Decks und mein Lernfortschritt dauerhaft gespeichert und geschützt sind.

**Deck- und Kartenverwaltung**

* Als Nutzer möchte ich Decks erstellen und umbenennen können, damit ich meine Lerninhalte thematisch strukturieren kann.
* Als Nutzer möchte Karten mit Frage und Antwort erstellen und bearbeiten können, damit ich meinen Lernstoff individuell zusammenstellen kann.
* Als Nutzer möchte Karten löschen können, damit mein Deck übersichtlich bleibt.

**Lernmodus**

* Als Lernender möchte ich eine Lernsession starten können, damit ich gezielt mit meinen Karten lernen kann.
* Als Lernender möchte ich nur die aktuell fälligen Karten sehen, damit ich meine Lernzeit effizient nutze.

**Bewertung & Fortschritt**

* Als Nutzer möchte ich angeben können, wie gut ich eine Antwort wusste, damit die App das nächste Wiederholungsintervall automatisch anpasst.

---

## Requirements

| ID      | Name                    | Priorität | Beschreibung                                                                                | Use Case |
|---------|-------------------------|-----------|---------------------------------------------------------------------------------------------|----------|
| REQ-001 | Benutzer registrieren   | MUST      | Benutzer kann ein Konto mit E-Mail und Passwort erstellen                                   | UC1      |
| REQ-002 | Benutzer anmelden       | MUST      | Benutzer kann sich authentifizieren; Session wird per HttpOnly-Cookie verwaltet             | UC1      |
| REQ-003 | Deck erstellen          | MUST      | Benutzer kann ein neues Deck anlegen und benennen                                           | UC2      |
| REQ-004 | Deck umbenennen         | MUST      | Benutzer kann den Namen eines bestehenden Decks ändern                                      | UC2      |
| REQ-005 | Karte erstellen         | MUST      | Benutzer kann Karten mit Frage und Antwort erstellen                                        | UC3      |
| REQ-006 | Karte bearbeiten        | MUST      | Benutzer kann Inhalte bestehender Karten ändern                                             | UC3      |
| REQ-007 | Karte löschen           | MUST      | Benutzer kann Karten aus einem Deck entfernen                                               | UC3      |
| REQ-008 | Lern-Session starten    | MUST      | Benutzer kann eine Lernsession für ein Deck starten                                         | UC4      |
| REQ-009 | Fällige Karten anzeigen | MUST      | System zeigt algorithmisch ausgewählte, fällige Karten an                                   | UC4      |
| REQ-010 | Antwort bewerten        | MUST      | Benutzer bewertet seine Antwort (Again/Hard/Good/Easy)                                      | UC5      |
| REQ-011 | Spaced Repetition Logik | MUST      | System berechnet basierend auf Bewertung das nächste Intervall und Fälligkeitsdatum         | UC5      |
| REQ-012 | Persistente Speicherung | MUST      | Alle Daten werden serverseitig in einer Datenbank gespeichert und einem Benutzer zugeordnet | Alle     |
| REQ-013 | REST-Kommunikation      | MUST      | Frontend kommuniziert über eine REST-API mit dem Backend                                    | Alle     |
| REQ-014 | Responsive Web-UI       | MUST      | Benutzeroberfläche funktioniert auf verschiedenen Bildschirmgrößen                          | Alle     |

### Kommunikationsfluss (Beispiele)

#### 1. Deck erstellen
UI (create-new-deck-page.ts)
  ↓ Nutzer gibt Name ein und klickt "Erstellen"
  ↓ Aufruf: `DeckService.createDeck(deckModel)`
Business Logic (Frontend)
  ↓ Sendet `POST /api/deck` an Backend
Controller (DeckController.cs)
  ↓ Empfängt Request, ruft `DeckService.CreateDeckAsync()`
Business Logic (Backend)
  ↓ Validiert Eingabe, erstellt `Deck` Entität
Data Access (CoreContext)
  ↓ `Decks.Add()` -> `SaveChanges()` persistiert in PostgreSQL DB

#### 2. Karte bewerten (Lernen)
UI (deck-learn-page.ts)
  ↓ Nutzer klickt Bewertung (z.B. "Good")
  ↓ Aufruf: `ProgressService.updateProgress(cardId, rating)`
Business Logic (Frontend)
  ↓ Sendet `POST /api/learning/update/{cardId}` mit Rating
Controller (ProgressController.cs)
  ↓ Empfängt Request, ruft `LearningService.LogProgressAsync()`
Business Logic (LearningService.cs)
  ↓ Berechnet neues Intervall/Fälligkeit (Spaced Repetition)
  ↓ Aktualisiert `Card` Status
Data Access (CoreContext)
  ↓ `SaveChanges()` speichert neuen Kartenstatus in DB

### Muss-/Kann-Kriterien
* **Muss**: Karten erstellen, Decks verwalten, Lernlogik (Algorithmus), Persistenz in Datenbank, REST-Schnittstelle.
* **Kann**: Benutzerverwaltung, Statistik-Ansicht, Import/Export.

---

## 3. Software-Architektur

![System Architecture](doc/uml/architecture.png)
*(Siehe: [doc/uml/architecture.puml](doc/uml/architecture.puml))*

### Architektur-Pattern
Die Anwendung folgt grundsätzlich einer **Client-Server-Architektur**, wobei das **MVC (Model-View-Controller)** Pattern logisch aufgeteilt und interpretiert wird:

*   **Model (Backend & Database)**:
    Die Datenstruktur und Geschäftslogik liegen zentral im Backend. Die Entitäten (`Card`, `Deck`, `Identity`) und die Business-Regeln (Lern-Algorithmus) bilden das Model. Dieses ist vollständig vom Frontend entkoppelt.
*   **Controller (Backend API)**:
    Die ASP.NET Core Controller fungieren als Schnittstelle. Sie nehmen Aktionen entgegen, manipulieren das Model und liefern Daten zurück. Sie kümmern sich *nicht* um die Darstellung (HTML).
*   **View (Frontend)**:
    Das Angular-Frontend übernimmt die Rolle der View. Es rendert die vom Backend empfangenen Daten und stellt die Benutzeroberfläche bereit. Gleichzeitig beinhaltet es eigene Logik zur Steuerung der Anzeige (Client-Side Controller Logik).

### Trennung von Frontend und Backend
Ein zentrales Merkmal dieser Architektur ist die strikte Trennung via **REST API**:

1.  **Unabhängiger Betrieb**: Frontend und Backend sind separate Projekte, die getrennt gebaut und deployed werden können (hier via Docker Container orchestriert).
2.  **Austauschbarkeit**: Da das Backend nur Daten (JSON) und kein UI liefert, ist das Frontend vollständig austauschbar.
3.  **Erweiterbarkeit**: Auf die existierende Backend-Struktur kann problemlos ein **weiterer Client** aufgesetzt werden. Beispielsweise könnte eine native **Smartphone-App** (iOS/Android) entwickelt werden, die dieselben API-Endpunkte nutzt wie die Webanwendung. Der Lernfortschritt wäre dabei sofort zwischen Web und App synchronisiert, da beide auf dieselbe Datenbank zugreifen.

---

## 4. Implementierung

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
       
![alt text](doc/spaced_repetition.png)

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
* **Struktur**: Nutzung von **Standalone Components**.
    * `Pages`: `Home`, `DeckPage`, `CreateNewDeckPage`, `LoginPage`.
* **Kommunikation**: `AuthService` managed den Login-Status. Die Kommunikation zum Backend erfolgt über Services (`DeckService`, `CardService`), die automatisch aus der OpenAPI-Spezifikation generiert wurden.
* **Internationalisierung**: Einsatz von `@ngx-translate` zur Unterstützung mehrerer Sprachen (DE/EN).

### Datenbank-Design
Das ER-Modell wurde relational umgesetzt und ist in folgendem Diagramm dargestellt:

![Entity Relationship Diagram](doc/uml/ERM.png)
*(Siehe auch lokal: [doc/uml/erm.puml](doc/uml/erm.puml))*

Das Datenmodell basiert auf drei zentralen Beziehungen:
*   **User zu Deck (1:n)**: Ein Nutzer kann beliebig viele Decks erstellen. Diese Beziehung definiert die Zugehörigkeit der Daten und ermöglicht, dass Nutzer nur Ihre eigenen Lerninhalte sehen.
*   **Deck zu Card (1:n)**: Ein Deck dient als Container für viele Karteikarten. Dies ermöglicht die logische Gruppierung von Lerninhalten.
*   **Deck zu Statistic (1:n)**: Pro Tag und Deck wird ein Statistik-Eintrag erstellt. Dieser speichert aggregierte Informationen über den Lernfortschritt (z. B. Anzahl gelernter Karten), während der aktuelle Lernzustand direkt in der jeweiligen `Card`-Entität gespeichert wird.

---

## 4. Deployment & Datenhaltung

### Aktueller Stand
Das System wird aktuell mittels **Docker Compose** betrieben, was eine einfache Inbetriebnahme der Backend-Komponenten ermöglicht.

* **Containerisierung**:
    * **Backend (API)**: Läuft in einem Docker-Container basierend auf dem .NET 8 SDK/Runtime Image. Es wird zur Laufzeit via Docker Build gebaut.
    * **Datenbank**: Ein offizieller PostgreSQL Container (`postgres:latest`).

### Datenpersistenz
* **Datenspeicherung**: Die Daten liegen ausschließlich im flüchtigen Dateisystem des PostgreSQL-Containers (`/var/lib/postgresql/data`).
* **Konsequenz**: Solange die Container laufen oder nur gestoppt (`docker stop`) werden, bleiben die Daten erhalten. Werden die Container jedoch entfernt (`docker compose down`), gehen alle Daten unwiderruflich verloren. Ursprünglich war hier die Idee, eine SQ-Lite Datenbank zu verwenden, um Daten auch offline lokal speicherbar zu machen. Dies wurde abgeändert, nachdem entschieden wurde die accountgebundene Nutzerverwaltung mit einzubauen.

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

