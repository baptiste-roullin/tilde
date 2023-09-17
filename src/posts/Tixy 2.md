---
title: Tixy – tuto #2
---

Tentatives d'explications de Tixy, avec différents exemples. C'est un bon exercice.

Tixy affiche une grille de 16x16 points. Chaque point est commandé par la fonction suivante.


Paramètres :

- t : le temps en secondes depuis le début de l'animation
- i : la position du point depuis le début de la grille
- x : la position du point la ligne
- y : la position du point dans la colonne

Valeur de retour attendue :
- un entier entre -1 et 1.
- positif : blanc avec une taille variable. Au-delà de 1, ça équivaut à 1.
- négatif : noir avec une taille variable. Au-delà de -1, ça équivaut à -1.
- zéro : invisible.

La fonction est exécutée pour chaque point et pour chaque battement de temps. Les arguments auront donc typiquement des valeurs différentes à chaque fois.

On peut taper [`(t,i,x,y) => 1`](https://tixy.land/?code=1) et obtenir que des cercles blancs. Les paramètres sont ignorés et on retourne toujours 1.

### [1/256](https://tixy.land/?code=i+%2F+256)

i a une valeur croissante, donc le ratio augmente, donc les cercles sont de plus en plus gros.

Après ça on rentre vite dans des subtilités de Javascript, c'est là où Tixy prend tout son sel.

Par exemple

### [Math.random() < 0.1 ](https://tixy.land/?code=Math.random%28%29+%3C+0.1)

On retourne un booléan qui va être évalué comme vrai ou faux. Si le chiffre est égal à 0.1, on renvoie Vrai, que Javascript convertit en 1. Sinon, on renvoie faux, convertit à zéro.

Tout ça grâce à la [coercition de type](https://developer.mozilla.org/fr/docs/Glossary/Type_coercion).

