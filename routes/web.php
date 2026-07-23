<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);

Route::get('/auth/google', function () {
    return Socialite::driver('google')->redirect();
});

//google auth login & Callback
Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();
    $user = User::where('email', $googleUser->getEmail())->first();

    if (!$user) {
        $user = User::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'password' => bcrypt(str()->random(32)),
        ]);
    }

    Auth::login($user);
        //Create a new Sanctum API token.
        $token = $user->createToken('google-login')->plainTextToken;

        return response()->json([
        'message' => 'Google login successful!',
        'token' => $token,
        'user' => $user,
        
    ]);
});