# webpack-sample-configs
Sample configurations for Webpack 2.0

## Základní principy Webpacku 2.0
### Specifikace
* **module bundler** = z mnoha modulů vytváří několik balíčků
* **práce s JavaScriptem** = hlavní účel
    * pro code splitting do modulů, protože browsery neumí moduly jako třeba Node.js
    * vytváření balíčků pro browser
* je však schopný transformovat, modifikovat, balíčkovat různé druhy assetů
* pro práci s moduly různých typů používá **loadery**

### Moduly
* Webpack moduly jsou ES modules, CommonJS a AMD, ale také @import z SASS
* moduly jsou kusy kódu (nejen), které jsou mezi sebou prolinkovány a tvoří komplexní program
* modul je cokoliv, co lze ‘importovat’ a zabalit pomocí Webpacku
* příklady:
    * css, sass, less
    * js, jsx, ts, coffee
    * png, jpg, svg
    * json, yaml, xm

### Konfigurace
* konfigurační soubor Webpacku je JS module, který exportuje konfiguraci
* je zpracováván Node.js, tudíž v něm lze dělat cokoli, co dokáže Node interpretovat
* Základní položky konfigurace:
    * **Entry** - popisuje vstup Webpacku (vstupní modul/y)
    * **Output** - jak má vypadat výstup z Webpacku (výstupní balíček/balíčky)
    * **Loaders** - jakým způsobem má Webpack zpracovávat moduly různých typů
    * **Pluginy** - jakým způsobem má Webpak zpracovávat balíčky

### Entry
* Říká, odkud má Webpack začít vytvářet balíček/ky (vytvářet graf závislostí)
* Druhy:
    * **String** = cesta k souboru, jeden entry point, jeden balíček
    * **Pole** = pole cest k souborům, více entry pointů, jeden balíček
    * **Objekt** = objekt pojmenovaných cest k souborům, více entry pointů, více balíčků
* V rámci konfigurace může být uveden context, cesty k souborů v entry se pak vztahují relativně k němu
* **Pravidlo:** jeden entry point na HTML stránku, SPA = jeden globální entry point, MPA = více entrypointů

### Output
* Nastavení ovlivňuje výstup z Webpacku
* Položky:
    * **path** = cesta do složky, kam má Webpack uložit balíček/ky
    * **filename** = název výstupního souboru
        * pokud je vstup string nebo pole, pak je můžeme použít nějaký název (např. bundle.js)
        * pokud je vstup objekt pak pro vystup použijeme template:
            * **name** = klíč ze vstupního objektu ([name].js)
            * **hash** = hash, který buildu vypočítal Webpack ([hash].js)
    * **publicPath** = používaná loadery (např url-loader) a pluginy, jedná se o cestu pod kterou bude balíček vystaven na serveru

### Loadery
* Jsou to transformace, které jsou aplikovány na moduly (soubory), než jsou přidány do balíčku
* Pomocí loaderu lze např načítat CSS, transformovat JSX do JS, převádět obrázky do base64 stringů
* Loadery lze za sebe řadit do pipeliny:
    * **sass-loader** zpracovává css a vrací css => **css-loader** vezme css a provede další úpravy => **style-loader** vytvoří JS kód, který toto css vloží do `<style>` tagu v hlavičce HTML
    * poslední loader v pipeline musí vrace JS kód

### Použití loaderů
* V konfiguraci v položce **module** v poli **rules/loaders** (Webpack 2.x/1.x)
    * loader je aplikován na soubor pokud je machnut regexp v položce **test**
    * loader je definován v položce **use/loader** (Webpack 2.x/1.x)
    * loader může mít nastavení v položce **options/query** (Webpack 2.x/1.x)
* Loader může být specifikován přímo v import stringu
    * **require(‘style-loader!css-loader?module!sass-loader./styles.sass);**
    * pipelina loaderů oddělena pomocí !
    * nastavení loaderu pomocí query stringu
    * aplikace loaderů z prava do leva od souboru k importu

### Pluginy
* Jsou aplikovány na balíčky
* Používají se pro funkcionalitu, kterou není loader schopen udělat
* Nastavují se v konfiguraci v poli plugins
    * položky pole jsou instance pluginů => můžeme mít více instancí jednoho pluginu dělající jinou práci
    * např. jedna instance provádí extrakci css pipeliny do samostatného css souboru, druhá výsledky sass pipeliny do samostatného css souboru
* Příklady:
    * vyčlenění vendor balíčků z NPM do samostatného souboru
    * extrakce css do samostatných souborů
    * definice globálních proměnných
    * obfuskace

### Jak to cca funguje
* Webpack si na základě **entry** vytvoří root/y grafu/ů závislostí
* Prochází jednotlivé moduly, tak jak jsou importovány do rootů a v zanoření a aplikuje na ně patřičné **loadery** podle konfigurace
* Po zpracování každého grafu z něj vytvoří balíček
* Na balíčky jsou následně aplikovány **pluginy**
* Zde může docházek k obfuskaci, extrakci vendorů do vlastních balíčků, nastavení ‘globálních’ proměnných atd., vlastně cokoli, co nejde udělat v loaderu
* Nakonec uloží soubory podle specifikace v **output**

## Chuťovečky
### Optimalizace velikosti balíčků vyčleněním vendorů
Máme-li `object entry`, pak vytvoří Webpack více balíčků. Sdílí-li tyto balíčky některé vendory, pak jsou zabaleni do každého balíčku. Balíčky začnou rychle nabývat na velikosti, pokud do každého přibalujeme například `React` či `jQuery`.
`CommonChunkPlugin` umožňuje vytvořit balíček vendorů, do kterého přidá specifikované vendory:
* Jenoduše přidáme nový záznam do `object entry`, kterým je pole vendorů
* poté v `CommonChunkPlugin` řekneme, že má toto entry vyčlenit do specifického souboru.
* Balíček vendorů je poté potřeba přidat do html dokumentu před ostatní balíčky, aby se načetl jako první.

### Deployment
* Utilita `webpack-merge` umožňuje spojení více konfigurací Webpacku
* V jednom `webpack.config.js` vytvoříme více objektů konfigurace:
    * **common** - konfigurace společná pro všechny typy deploymentu
    * **production** - konfigurace potřebná pro produkci
    * **development** - konfiurace potřebaná pro developemnt
    * atd.
* Použijeme `webpack-merge` a `process.env.NODE_ENV` pro vytvoření správné konfigurace pro export z `webpack.config.js`

### Development
Pro vývoj lze využít dva typy přístupu:
* `webpack-dev-server` poskytuje jednoduchý webserver, jehož nastavení se přidá do konfigurace
    * spustí se pomocí `webpack-dev-server --config webpack.config.js`
    * servuje data z nastavené složky, hledá primárně index.html
    * provádí watch souborů a livereload
    * **usecase**: pro javascriptové single page aplikace
* `webpack-livereload-plugin` v kombinaci s `--watch` módem
    * nastaví se jako plugin do konfigurace webpacku
    * předá url JS souboru, který se vloží do html a pomocí `websocketů` provádí livereload stránky
    * spustí se pomocí `webpack --watch --config webpack.config.js`
    * **usecase**: v projektu kde používáte Webpack pro transpiling js a css (např. v kombinaci s Django, Symfony)

### Základní loadery
#### Práce se soubory
##### file-loader
Uloží soubor jako soubor do **output.path**, defaultně pod jménem `[hash].[ext]`, kde **hash** je md5 obsahu obrázku a **ext** je původní koncovka.
Vrací public url určené z **output.publicPath** `/publicPath/[hash].[ext]`
Lze upravovat jména za pomocí template stringů [viz. dokumentace](https://webpack.js.org/loaders/file-loader/)
##### url-loader
Funguje stejně jako **file-loader**, akorát pro specifikovanou velikost vrací base64 string místo public url.
Více [viz. dokumentace](https://webpack.js.org/loaders/url-loader/)
#### Práce se styly
##### style-loader
Jelikož Webpack pracuje nad javascript a umí tedy loadovat pouze javascript, je nutné importované styly nějakým způsobem zpracovat.
**style-loader** načte styly a vytvoří js kod, který tyto styly po svém spuštění vloží do hlavičky html dokumentu, ve kterém byl spuštěn.
Toto použití dává smysl, pokud používáme Webpack navíc s nějakým loaderem, který provádí build stylů (**sass-loader** atd.).
Lze použít i v kombinaci s **file-loaderem**, kdy přidá do hlavičky místo zbuilděných stylů jen `<link rel="stylesheet">` na zadaný soubor
Více [viz. dokumentace](https://webpack.js.org/loaders/style-loader/)
##### css-loader
Přidává další zpracování nad css. Například dovoluje zpracování `@import` a `url()` pomocí **file-loaderu** nebo **url-loaderu**
Také může například minimalizovat css.
Více [viz. dokumentace](https://webpack.js.org/loaders/css-loader/)
##### sass-loader
Provádí transpiling **sass** do **css**. Používá se v kombinaci s **css-loaderem** a **style-loaderem**
Stejným způsobem lze také zpracovávat **less** pomocí **less-loaderu** nebo **stylus** pomocí **stylus-loaderu**
Více [viz. dokumentace](https://webpack.js.org/loaders/css-loader/)
#### Transpiling do JS
##### babel-loader
Provádí transpiling **ES6**, **ES7** atd do verze javascriptu, který je podporován v prohlížečích (dnes je plně podporováno **ES5**). Umí také překládat **JSX**.
Konfiguraci lze provést v nastavení loaderu v konfiguraci Webpacku nebo v samostatném **.babelrc** souboru.
V konfiguraci lze specifikovat, které verze standartu **EcmaScript** má překládat atd.
Stejně lze provést například transpilaci **coffeescriptu** do javascriptu pomocí **coffee-loaderu**.
Více [viz. dokumentace](https://webpack.js.org/loaders/babel-loader/)
#### Řešení závislostí jQuery pluginů a spolu
##### imports-loader
Umožňuje jednoduše dynamicky přidat import (require) do specifickovaného modulu.
Připojí například `var $ = require('jquery')` na začátek specifikovaného souboru.
Více [viz. dokumentace](https://webpack.js.org/loaders/imports-loader/)
##### expose-loader
Některé pluginy mohou záviset na nastavení globálních proměnných (v proměnné `window`). Tento plugin dovoluje vystavit zadaný modul jako globální proměnnou do `window` a tak vyřešit závislosti.
Více [viz. dokumentace](https://webpack.js.org/loaders/expose-loader/)




