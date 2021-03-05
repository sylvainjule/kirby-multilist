<?php

Kirby::plugin('sylvainjule/multilist', array(
    'fields' => [
        'multilist' => [
            'extends' => 'structure',
            'validations' => [
                'customValidation' => function($value) {
                    // needs custom validator
                    // $errors = [];
                    // foreach($value as $row) {
                    //     $rowErrors = array_values($this->form($row)->errors());
                    //     if(count($rowErrors)) array_merge($errors, $rowErrors);
                    // }
                    // ...
                }
            ]
        ]
    ],
));
