<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{   
    public function index()
    {
        return Category::all();
    }

    public function show(Category $category)
    {
        return $category->load('products');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);

        return Category::create([
            'name' => $request->name
        ]);
    }
    
}