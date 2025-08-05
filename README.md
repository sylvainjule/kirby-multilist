# Kirby Multilist

This plugin helps dealing with long lists with multiple fields.

![multilist-screenshot](https://user-images.githubusercontent.com/14079751/110128561-3967cd00-7dc7-11eb-96cd-f8522de39f8b.png)

<br/>

## Overview

> This plugin is completely free and published under the MIT license. However, if you are using it in a commercial project and want to help me keep up with maintenance, you can consider [making a donation of your choice](https://paypal.me/sylvainjl).

- [1. Installation](#1-installation)
- [2. Setup](#2-setup)
- [3. Supported fields](#3-field-types)
- [4. Field properties](#4-field-properties)
- [5. Front-end usage](#5-front-end-usage)
- [6. Drawbacks](#6-drawbacks)
- [7. License](#7-license)


<br/>

## 1. Installation

> Kirby 3, 4: up to 1.0.2 (untested). Kirby 5: 1.1.0+

Download and copy this repository to ```/site/plugins/multilist```

Alternatively, you can install it with composer: ```composer require sylvainjule/kirby-multilist```

<br/>

## 2. Setup

Use is as you would use [a Structure](https://getkirby.com/docs/reference/panel/fields/structure):

```yaml
multilist:
  label: Multilist example
  type: multilist
  fields:
    name:
      label: Item name
      type: text
    date:
      label: Release date
      type: date
    toggle:
      label: Listed?
      type: toggle
```

Since `1.1.0`, you can use the structure's `columns` option to display only a few fields in the table, and edit them all in the usual structure drawer.

<br/>

## 3. Supported fields

The field supports all *inline* field types:

- `color`
- `date`
- `email`
- `multiselect`
- `number`
- `range`
- `select`
- `slug`
- `tel`
- `text`
- `time`
- `tags`
- `toggle`
- `url`

More complex fields (files, pages, structure, blocks, layout, etc.) **are not supported**.

<br/>

## 4. Field properties

You have access to all the [Structure field properties](https://getkirby.com/docs/reference/panel/fields/structure#field-properties).

<br/>

## 5. Front-end usage

Use it as you would use a structure field, with either the `->toStructure()` ou `->yaml()` method.

<br/>

## 6. Responsive

The field behaves like any <em>Structure</em> field: on mobile only the first column will be shown. All the fields remain editable through the usual structure drawer.

<br/>

## 7. License

MIT
