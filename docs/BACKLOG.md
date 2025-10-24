# Backlog (up to date: 19 septembre 2025)

---

## FONTS

- [ ] Checker rendu italic et gras pour fonts **Arapey** et **Old Standard** sur autre browser que Google Chrome Desktop, car j'ai volontairement choisi que des 400 en Roman et pas sûr que le rendu soit identique.

## CSS

- [ ] Padding/margin type de valeur → changer les valeurs des paddings/margins de `px` à `rem` ?

## TESTING

- [ ] Tester les `<title>` et meta description avec des tests end-to-end, car ces logiciels peuvent monter le fichier `index.html` que Vitest ne peut pas faire.
- [ ] Écrire tests pour les composables
- [ ] Écrire tests pour les stores
- [ ] Écrire tests pour les API (Postman)
- [ ] Écrire tests pour le router
- [ ] Remplacer `exists` par `isVisible`
- [ ] Structurer les tests en 3 parties : Smoke Test ; Renders ; Behaviors

## DOCUMENTATION

- [ ] Écrire doc pour la fonctionnalité `h()` et le composant mocké associé pour expliquer :
  - les raisons d’emploi de `h()`
  - comment créer le composant mocké (il fallait récupérer la variable `activeIndex` pour la passer au composant mocké afin de faire les tests)

## REFACTOS

- [ ] Refacto / création d’un `SlideShowSlickSliderButton` pour la feature `SlideShowSlickSlider`.
- [ ] MyTransition : refacto pour continuer d'utiliser name, mais en passant en props les informations nécessaire pour les CSS afin de découpler les CSS actuels des éléments sur lesquelles elles sont utilisées.

## TYPES

- [ ] Changer `UseFetchWithStateReturn` en `UseAsyncFetchResult`.
- [ ] Changer `FetchState` en `AsyncFetchStates`.

## DATABASE

- [ ] Fixer bug qui ajoute des `id` non voulus dans la database lorsqu’on souscrit à la newsletter en dev.

## PERFS

- [ ] Au build, enlever les `data-testid`.
- [ ] WTF : les loading lazy de la HP ne se font pas vraiment au scroll, mais presque tout est téléchargé à l’initial render ?
- [ ] WTF : au redimensionnement mobile/desktop, les images du slideshow déjà téléchargées se retéléchargent ?
- [ ] INP dans DevTools ne semblent pas se produire sur un touch device en prod. Solutions possibles :
  - Mettre un `.prevent` sur `touchstart`
  - CSS → ajouter `html { touch-action: manipulation }`  
    Après test sur mon mobile, il ne semble pas y avoir de delay.

## UX

- [ ] Check le passage de mobile à desktop, car il y a comme un saut de l'image produit mobile du carrousel.
