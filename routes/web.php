<?php

use Illuminate\Support\Facades\Route;

/**
 * Serve the Vue 3 SPA for all frontend routes.
 */
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
