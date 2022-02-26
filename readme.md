# Beats Reality Post Tool

A script for posting radio show posts to a WordPress site via WP REST API.

Takes a markdown file with yaml front matter as input.

Developed to simplify posting my radio show Beats Reality.

## Setup
Add a new [application password](https://developer.wordpress.org/rest-api/reference/application-passwords/) in your WordPress admin then configure host and access in `.env` file in root:

```
WP_BASE_URL=https://mywebsite.com/wp-json/wp/v2/
WP_USER=mary
WP_PASSWORD=ERMWO4567VBN#$%^&
```

## Usage

```
npm start -- -t '/Users/mary/shows/20220223/20220223-tracklist.md'
```

This will take the contents of the provided file and publish a new post on the configured ste.

### Example file

```
---
title: Beats Reality 20220223
tags: 
    - deephouse
    - techhouse
    - techno
mixcloud_url: https://www.mixcloud.com/haszari/beats-reality-dj-mix-only-20220223/
mixcloud_url_r1: https://www.mixcloud.com/haszari/beats-reality-dj-mix-only-20220223/
---

**Claro Intelecto** – *Messages*
**Aroma Pitch** – *Somewhere Close By*
**Compuphonic** – *Walking on the Edge*
**Röyksopp** – *Sordid Affair* - **Maceo Plex** remix
**Ross from Friends** – *Epiphany*
**Sage Armstrong** – *Murakami Water*
**Extrawelt** – *Neuland*
**LCY** – *Teeth*
**Isaac Chambers** – *Flutter*
**Paraleven** – *Lucid* (feat. *Nathan Ball*) - **Icarus** remix
**Silverlining** – *Easy Living*
**Juan Sanchez** – *LAB04*
**Tennyson** – *False Enemy (of Mary Tudor)*
```