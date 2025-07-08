<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
  public function index(){ return auth()->user()->courses; }
  public function store(Request $r){
    $data = $r->validate(['title'=>'required']);
    return Course::create(array_merge($data,['teacher_id'=>auth()->id()]));
  }
  public function show($id){ return Course::findOrFail($id); }
  public function update(Request $r,$id){
    $c=Course::where('teacher_id',auth()->id())->findOrFail($id);
    $c->update($r->validate(['title'=>'required']));
    return $c;
  }
  public function destroy($id){
    Course::where('teacher_id',auth()->id())->findOrFail($id)->delete();
    return response()->noContent();
  }
}

