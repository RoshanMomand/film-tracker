# Film en Serie Tracker

Een kleine webapp om je eigen films en series bij te houden. De backend is gebouwd met Symfony en Doctrine, de frontend met HTML en plain JavaScript. Ze praten met elkaar via een JSON API.

## Project draaien

**Nodig:** PHP 8.4 of hoger (Symfony 8.1 vereist dit), Composer en de PHP-extensie `pdo_sqlite`. Als database gebruik ik SQLite, dus je hoeft geen databaseserver te installeren.

```bash
git clone https://github.com/RoshanMomand/film-tracker.git
cd film-tracker
composer install
php bin/console doctrine:migrations:migrate --no-interaction
```

Start daarna de server met de Symfony CLI:

```bash
symfony serve
```

Of met de ingebouwde PHP-server:

```bash
php -S localhost:8000 -t public/
```

Open daarna http://localhost:8000.

De database wordt aangemaakt in `var/data_dev.db`.

## Wat werkt er

### Verplicht

- Entity `Title` met naam, type (film of serie), jaartal en gezien (ja/nee)
- API endpoints:

  | Methode | URL | Wat het doet |
  |---|---|---|
  | GET | `/api/titles` | Alle titels ophalen |
  | POST | `/api/titles` | Titel toevoegen |
  | DELETE | `/api/titles/{id}` | Titel verwijderen |

- Een HTML-pagina met de lijst van titels, een formulier om titels toe te voegen en een knop om ze te verwijderen

### Uitbreidingen

- **Bewerken:** `PUT /api/titles/{id}`, met een aparte bewerkpagina (`/titles/{id}/edit`)
- **Validatie:** naam en type mogen niet leeg zijn, en het jaartal moet een positief getal zijn. Dit gebeurt in de backend via een DTO (`src/Dto/TitleInput.php`) met `#[MapRequestPayload]`. Bij foute invoer krijg je een `422` met een foutmelding, en die verschijnt ook op de pagina.
- **Zoeken op titelnaam:** als er niets gevonden wordt, zie je alle titels.
- **Filteren:** op films, series of gezien
- **Overzicht als tabel**

## Wat niet af is

- **Genres** (een apart entity met een relatie). Dit wilde ik graag doen, maar ik wil me eerst grondig verdiepen in relaties in Doctrine en daarmee oefenen buiten dit project. Ik heb liever een kleine, nette basis dan een halve uitbreiding.
- **Tests:** er zijn nog geen tests geschreven.
- **Login:** ik heb SecurityBundle geïnstalleerd met het idee om titels per gebruiker te tonen, maar dit is niet uitgewerkt. De config staat erin, maar wordt nog niet gebruikt.
- **Rating, een knop voor "gezien" in de lijst, React:** niet aan begonnen. Voor React heb ik bewust niet gekozen (zie hieronder).

## Aanpak

Ik wist al dat de opdracht in de kern een CRUD-applicatie was. Ik ben begonnen met het lezen van de grote richtlijnen in de Symfony-documentatie, bijvoorbeeld hoe je een entity maakt en hoe Doctrine werkt. Aan Claude heb ik gevraagd welke delen van de docs ik moest lezen om inzicht te krijgen in de concepten die ik voor deze opdracht nodig had.

Daarnaast heb ik Claude gevraagd om vergelijkingen te maken met Laravel. Laravel is voor mij bekend terrein, en daardoor kon ik de concepten sneller oppakken en begrijpen wat de bedoeling was. Een paar voorbeelden:

- De DTO met `#[MapRequestPayload]` lijkt op een FormRequest.
- `persist()` + `flush()` doet wat `save()` in Eloquent doet.
- Entity value resolving lijkt op route model binding.

Volgorde van werken:

1. Project opgezet, SQLite gekozen (geen aparte databaseserver nodig)
2. Entity `Title` en de migration
3. API endpoints, en die getest met `curl` voordat ik aan de frontend begon
4. De frontend: een Twig-pagina met JavaScript in een apart bestand
5. De uitbreidingen: bewerken, zoeken, filteren, de tabel

Ik heb eerst de backend gebouwd en getest, zodat ik bij de frontend zeker wist dat eventuele fouten in het JavaScript zaten en niet in de API.

Voor de frontend heb ik bewust plain JavaScript gebruikt en geen React. React met hooks neemt veel uit handen, en ik wilde mijn JavaScript-basis weer opfrissen.

## Waar ik tegenaan liep

- **Terug naar de basis van JavaScript was even wennen.** Frameworks nemen zo veel uit handen dat dingen als `fetch()`, de DOM en event listeners weer oefenen was. Een voorbeeld: mijn script stond eerst in de `<head>` (via `{% block javascripts %}`) en draaide daardoor voordat het formulier bestond.
- **Symfony tegenover Laravel.** Laravel heeft veel kant-en-klaar voorgekauwd. In Symfony stel je meer zelf samen: de serializer, de validator en de routes als attributes. Ik begrijp het concept, maar ik moet nog dieper in de stof duiken en meer oefenen.
- **Waar logica hoort in Symfony** (buiten de controllers) was even uitzoeken.
- **DTO's:** ik begreep eerst niet waarom je een DTO nodig hebt als de frontend het formulier al controleert. Nu snap ik dat de backend de invoer altijd zelf moet valideren, omdat de API ook los van de pagina aangeroepen kan worden. Hoe je een DTO gebruikt voor bijvoorbeeld bewerken of gedeeltelijke updates, en wanneer je wel of niet direct naar de entity mapt, moet ik nog meer oefenen.
- **Git:** de editor-bestanden van PhpStorm (`.idea`) waren per ongeluk gecommit. Die heb ik er later uitgehaald en in `.gitignore` gezet.
- **Naamgeving:** ik merk dat mijn naamconventies voor variabelen en functies soms beter kunnen.

## Gebruik van AI

AI was toegestaan, en ik heb Claude (Claude Code) en de code completion in PhpStorm gebruikt.

**Claude heb ik gebruikt voor:**

- **Uitleg:** welke documentatie ik moest lezen, en vergelijkingen met Laravel om Symfony-concepten sneller te begrijpen. Als ik te lang vastzat op iets wat ik zelf aan het opzoeken was, liet ik Claude het uitleggen.
- **HTML:** de HTML heb ik grotendeels door Claude laten maken, en dan vooral het typwerk en de plain HTML.
- **Waar logica hoort:** de logica heb ik zelf toegepast. Waar nodig heb ik gevraagd waar bepaalde logica hoorde in de structuur van Symfony.
- **Corrigeren en verbeteren:** Claude heeft mijn code nagelopen, fouten aangewezen en de endpoints getest met `curl`. Voorbeelden zijn een ontbrekend `#[MapRequestPayload]`, ontbrekende `use`-regels, en een `case 'film' || 'serie'` die niet deed wat ik verwachtte.
- **Als ik echt vastzat:** alleen op die momenten heb ik Claude een stuk laten aanpassen of uitwerken. Dat was bij de bewerkpagina, bij het opsplitsen van het JavaScript in aparte bestanden, en bij het verbeteren van mijn zoekfunctie.
- **Naamgeving:** soms heb ik gevraagd naar betere namen voor variabelen of functies.
- **Deze README:** ik heb Claude gevraagd de README op te stellen aan de hand van mijn eigen uitleg over hoe ik het heb aangepakt.

**De code completion van PhpStorm** hielp me vooral de juiste functies en methodes te vinden.

Ik wil hier eerlijk over zijn. Ik heb nog maar weinig met Symfony gewerkt, en ik moet nog veel oefenen, vooral met DTO's, Doctrine-relaties en plain JavaScript. Dat zie ik niet als probleem: dankzij mijn ervaring met Laravel pak ik nieuwe concepten snel op. Dit project heeft me een goede basis gegeven om op verder te bouwen.

## Tijdsbesteding

In totaal ongeveer 5,5 uur, verspreid over meerdere dagen.
