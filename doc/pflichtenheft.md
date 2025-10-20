---
title: Pflichtenheft LernApp
author:
  - Jannis Nau
  - Florian Kaiser
  - Jochen Heimüller
geometry: margin=2cm
output:
  pdf_document:
    latex_engine: xelatex
header-includes:
  - \usepackage{longtable}
  - \usepackage{array}
  - \usepackage{booktabs}
  - \renewcommand{\arraystretch}{1.2}
  - \setlength{\tabcolsep}{6pt}
  - \usepackage{makecell}
  - \renewcommand{\theadfont}{\bfseries}
---

## **1. Grundlegende Problemstellung**


Physische Karteikarten sind oft mühsam zu Transportieren und nichtmehr zeitgemäß. Digitale Lern-Apps sind auf dem Vormarsch und bieten dank intelligenter Algorithmen verbesserten Lernerfolg. Auch Hochschulalltag fällt es Studierenden häufig schwer, sich Wissen langfristig und effizient anzueignen. Klassische Lernmethoden wie das wiederholte Lesen von Skripten führen nur zu kurzfristigen Lernerfolgen. Digitale Lernkarten-Systeme (z. B. Anki) setzen auf sogenannte *Spaced Repetition*-Algorithmen, um Wissen durch zeitlich optimierte Wiederholungen zu festigen.

**Ziel** des Projekts Lern-App ist die Entwicklung einer **einfach bedienbaren, webbasierten Lernkarten-App**, die auf modernen Softwarearchitekturprinzipien basiert.
Der Fokus liegt auf:

* einer klar strukturierten Architektur mit Trennung von Frontend, Backend und Datenhaltung,
* einer intuitiven Benutzeroberfläche,
* der Umsetzung eines anpassbaren Wiederholungsalgorithmus.

Das System soll prototypisch zeigen, wie Lernprozesse technisch und architektonisch effizient unterstützt werden können.

## **2. Technologieauswahl**

| Komponente            | Technologie                                                         | Begründung                                                                                                               |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**          | **Angular (TypeScript)**                                            | Klare Komponentenstruktur, gute Unterstützung für modulare und reaktive Webanwendungen, etablierter Enterprise-Standard. |
| **Backend**           | **.NET 8 / ASP.NET Core Web API (C#)**                              | Hohe Performance, saubere Trennung von Logik und Datenzugriff, gute Unterstützung für REST-basierte Architekturen.       |
| **Datenbank**         | **SQLite (lokal)** oder **PostgreSQL (optional)**                   | Relationales Schema für Karten/Decks; SQLite genügt für Prototyp.                                                        |
| **Styling**           | **Angular Material** oder **Bootstrap**                     | Einheitliches UI-Design, responsive Darstellung.                                                                         |
| **Architektur** | **Client-Server mit REST-Schnittstelle (MVC / Clean Architecture)** | Fördert Wartbarkeit, Testbarkeit und Erweiterbarkeit.                                                                    |
| **Tests**             | **xUnit / NUnit (Backend)**, **Jasmine + Karma (Frontend)**         | Sicherstellung der Funktionalität und Stabilität.                                                                        |

## **3. Use Cases**

| Titel                  | Beschreibung                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Karte anlegen**      | Benutzer erstellt eine Karte mit Frage, Antwort und optionalen Tags.                                              |
| **Deck verwalten**     | Erstellen, Umbenennen, Löschen und Gruppieren von Kartendecks.                                                    |
| **Lernmodus starten**  | Benutzer startet eine Lernsession für ein Deck. Karten werden je nach Lernfortschritt angezeigt.                  |
| **Karte bewerten**     | Nach dem Anzeigen der Antwort bewertet der Benutzer, wie gut er die Karte wusste ("einfach", "mittel", "schwer"). |
| **Statistik anzeigen** | Anzeige des Lernfortschritts und Wiederholungsstatus.                                                             |

## **4. Muss- / Kann-Kriterien**

### **Muss-Kriterien**

* Erstellung und Verwaltung von Lernkarten und -decks
* Lernmodus
* Persistente Datenspeicherung
* Weboberfläche
* REST-basierte Kommunikation zwischen Frontend und Backend
* Grundlegende Testabdeckung

### **Kann-Kriterien**

* Benutzerverwaltung
* Import/Export von Decks
* Fortschrittsdiagramme
* Optionale Cloud-Synchronisierung