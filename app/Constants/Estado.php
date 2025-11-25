<?php

namespace App\Constants;

abstract class Estado
{
    const PENDIENTE = 1;
    const ENVIADO = 2;
    const APROBADO = 3;
    const RECHAZADO = 4;

    public static function list(){
        return [
            ['value' => self::PENDIENTE, 'label' => 'Pendiente'],
            ['value' => self::ENVIADO, 'label' => 'Enviado'],
            ['value' => self::APROBADO, 'label' => 'Aprobado'],
            ['value' => self::RECHAZADO, 'label' => 'Rechazado'],
        ];
    }
}
