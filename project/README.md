# 🎮 Phaser Game – Minimalprojekt

Ein einfaches Phaser-Spiel, bei dem ein roter Kreis in der Mitte des Bildschirms erscheint und sich mit den Pfeiltasten nach **links** und **rechts** bewegen lässt.  
Automatisierte Tests mit **Jest** und **Deployment über GitHub Pages** sind integriert.

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