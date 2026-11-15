<?php

use SylvainJule\Multilist\MultilistField;

load([
    MultilistField::class => 'lib/MultilistField.php',
], __DIR__);

Kirby::plugin('sylvainjule/multilist', [
    'fields' => [
        'multilist' => MultilistField::class,
    ],
]);