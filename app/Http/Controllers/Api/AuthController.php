<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
  public function login(Request $req)
  {
    $creds = $req->validate([
      'email'    => 'required|email',
      'password' => 'required',
    ]);

    if (! Auth::attempt($creds)) {
      return response()->json(['message'=>'Invalid credentials'], 401);
    }

    $user  = Auth::user();
    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
      'user'  => $user,
      'token' => $token,
    ], 200);
  }

  public function logout(Request $req)
  {
    // delete only the current bearer token
    $req->user()->currentAccessToken()->delete();
    return response()->json(['message'=>'Logged out'], 200);
  }
}
