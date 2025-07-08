<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  public function index(Request $r)
  {
    return User::when($r->role,fn($q)=>$q->where('role',$r->role))
               ->paginate();
  }

  public function store(Request $r)
  {
    $data = $r->validate([
      'firstname'=>'required',
      'lastname'=>'required',
      'email'=>'required|email|unique:users',
      'password'=>'required|min:8',
      'role'=>'required|in:admin,teacher,student,parent',
    ]);
    $data['password']=Hash::make($data['password']);
    return User::create($data);
  }

  public function show($id) { return User::findOrFail($id); }
  public function update(Request $r,$id)
  {
    $u = User::findOrFail($id);
    $data = $r->validate([
      'firstname'=>'sometimes',
      'lastname'=>'sometimes',
      'email'=>"sometimes|email|unique:users,email,{$id}",
      'password'=>'nullable|min:8',
      'role'=>'sometimes|in:admin,teacher,student,parent',
    ]);
    if($data['password']??false) $data['password']=Hash::make($data['password']);
    else unset($data['password']);
    $u->update($data);
    return $u;
  }
  public function destroy($id){ User::findOrFail($id)->delete(); return response()->noContent(); }
}
