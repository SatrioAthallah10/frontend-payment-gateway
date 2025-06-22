<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Debt;
use App\Http\Resources\DebtResource;
use App\Http\Resources\ErrorResource;
use App\Http\Resources\DebtCollection;
use App\Http\Resources\SuccessResource;
class DebtController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() : DebtCollection
    {
        $debts = Debt::latest()
            ->with(['user'])
            ->get();
        return new DebtCollection($debts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) : DebtResource
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $request->merge(['user_id' => auth()->id()]);
        $debt = Debt::create($request->all());
        return new DebtResource($debt);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) : DebtResource
    {
        $debt = Debt::with(['user'])->findOrFail($id);
        return new DebtResource($debt);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) : DebtResource
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        
        $debt = Debt::findOrFail($id);
        // if($debt->user_id !== auth()->id()) {
        //     return (new ErrorResource(['message' => 'Unauthorized']))
        //         ->response()
        //         ->setStatusCode(403);
        // }
        $debt->update($request->all());
        return new DebtResource($debt);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) : SuccessResource
    {
        $debt = Debt::findOrFail($id);
        if($debt->user_id !== auth()->id()) {
            return (new ErrorResource(['message' => 'Unauthorized']))
                ->response()
                ->setStatusCode(403);
        }
        $debt->delete();
        return new SuccessResource(['message' => 'Debt deleted successfully']);
    }
}
