# Dino-Jump
Dino Jump ist ein Einzelspieler-Jump-and-Run-Spiel für den Desktop, das auf dem bekannten Chrome-Dino-Spiel basiert. Der Spieler übernimmt die Steuerung eines laufenden Dinosauriers, der in einer endlosen 2D-Wüstenlandschaft Hindernissen wie Kakteen und Pterodaktylen ausweichen muss.

---

## 🚀 Live-Demo

> Sobald dein Workflow erfolgreich durchläuft, wird das Spiel automatisch auf GitHub Pages veröffentlicht:  
> 📍 `https://<dein-username>.github.io/<repository-name>/`

---

## 📁 Projektstruktur

```bash
├── index.html              # HTML-Datei mit Phaser-CDN
├── js/
│   └── game.js             # Phaser-Logik (bewegbarer Kreis)
├── tests/
│   └── game.test.js        # Unit-Tests mit Jest
├── package.json            # Projekt- und Test-Konfiguration
└── .github/
    └── workflows/
        └── phaser.yml      # GitHub Actions Workflow