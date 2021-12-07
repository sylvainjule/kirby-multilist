# Kirby Multilist

This plugin helps dealing with long lists with multiple fields.

![multilist-screenshot](https://user-images.githubusercontent.com/14079751/110128561-3967cd00-7dc7-11eb-96cd-f8522de39f8b.png)

<br/>

## Overview

> This plugin is completely free and published under the MIT license. However, if you are using it in a commercial project and want to help me keep up with maintenance, please consider [making a donation of your choice](https://paypal.me/sylvainjl) or purchasing your license(s) through [my affiliate link](https://a.paddle.com/v2/click/1129/36369?link=1170).

- [1. Installation](#1-installation)
- [2. Setup](#2-setup)
- [3. Supported fields](#3-field-types)
- [4. Field properties](#4-field-properties)
- [5. Front-end usage](#5-front-end-usage)
- [6. Drawbacks](#6-drawbacks)
- [7. License](#7-license)

## 1. Installation

Download and copy this repository to ```/site/plugins/multilist```

Alternatively, you can install it with composer: ```composer require sylvainjule/kirby-multilist```

<br/>

## 2. Setup

Use is as you would use [a Structure](https://getkirby.com/docs/reference/panel/fields/structure) :

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

<br/>

## 3. Supported fields

The field supports all *inline* field types:

- `text`
- `url`
- `email`
- `select`
- `multiselect`
- `number`
- `tel`
- `tags`
- `range`
- `toggle`
- `time`
- `date`
- `hidden`

More complex fields (files, pages, blocks, layout, etc.) **are not supported**.

<br/>

## 4. Field properties

You have access to a lot of the [Structure field properties](https://getkirby.com/docs/reference/panel/fields/structure#field-properties), with a few tweaks:

- There is no `columns` property, instead you can directly set a `width: x/x` property on your inner fields.
- There is no `duplicate` property.

<br/>

## 5. Front-end usage

Use it as you would use a structure field, with either the `->toStructure()` ou `->yaml()` method.

<br/>

## 6. Drawbacks

I have intended this field for websites where editors edit content on desktops. Due to the complex naure of the field, it doesn't have any mobile aternate view.

<br/>

## 7. License

MIT
