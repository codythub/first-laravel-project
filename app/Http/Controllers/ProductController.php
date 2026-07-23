<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;


class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('min_price')) {
        $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
        $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('sort')) {
        $query->orderBy('price', $request->sort);

    }

    return ProductResource::collection($query->paginate(5));
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load('category'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required',
            'sku' => 'required|unique:products',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }
        
        $product = Product::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'sku' => $request->sku,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required',
            'sku' => 'required|unique:products,sku,' . $product->id,
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = $product->image;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $request->name,
            'sku' => $request->sku,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'description' => $request->description,
        ]);

        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.'
        ]);
    }
}