<h1>Talion</h1>
<h3>Une application moderne pour l'exploration et l'analyse des cas juridiques.</h3>

Talion est une application interactive qui simplifie la recherche et l'analyse juridique. Grâce à une interface utilisateur fluide et des fonctionnalités puissantes comme la recherche avancée, les filtres dynamiques et des animations immersives, Talion est conçue pour les professionnels du droit et les étudiants.
Fonctionnalités principales

    🔎 Recherche avancée : Effectuez des recherches par mots-clés et découvrez des résultats pertinents.
    ⚙️ Filtres dynamiques : Filtrez les résultats par période, type de document, ou juridiction.
    📚 Cas pratiques interactifs : Explorez des exemples détaillés avec solutions et portée juridique.
    🌗 Mode sombre intégré : Profitez d'une expérience utilisateur optimale même dans des environnements sombres.
    💡 Animations immersives : Des transitions fluides pour une navigation intuitive.

Technologies utilisées

    Frontend : React avec TypeScript
    UI Components : Composants personnalisés basés sur Input, Button, Card, et Select.
    Animations : Framer Motion pour des transitions dynamiques.
    Mock Data : Structure JSON simulée pour tester les fonctionnalités.
    CSS : Gestion des thèmes clair/sombre via des classes CSS.

Installation et démarrage
Prérequis

    Node.js (version 16 ou supérieure)
    npm ou yarn

Étapes

    Clonez ce dépôt :

git clone https://github.com/votre-utilisateur/talion.git

Accédez au répertoire du projet :

cd talion

Installez les dépendances :

npm install
# ou
yarn install

Démarrez le serveur de développement :

npm run dev
# ou
yarn dev

Accédez à l'application dans votre navigateur :

    http://localhost:3000

Structure du projet

Voici un aperçu des fichiers et dossiers principaux du projet :

talion/
├── public/              # Fichiers statiques (images, favicon)
├── src/
│   ├── components/      # Composants UI (Card, Input, Select, etc.)
│   ├── pages/           # Pages principales de l'application
│   ├── styles/          # Fichiers CSS globaux
│   ├── App.tsx          # Point d'entrée de l'application
│   └── mockData.ts      # Données fictives pour les tests
├── README.md            # Documentation du projet
└── package.json         # Fichier de configuration npm/yarn

Scripts disponibles
Démarrage du projet

npm run dev
# ou
yarn dev

Construction pour la production

npm run build
# ou
yarn build

Linting et formatage

npm run lint
# ou
yarn lint