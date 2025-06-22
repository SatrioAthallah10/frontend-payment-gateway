<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class DebtCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'debts' => $this->collection->map(function ($debt) {
                return [
                    'id' => $debt->id,
                    'name' => $debt->name,
                    'description' => $debt->description,
                    'user' => [
                        'id' => $debt->user->id,
                        'name' => $debt->user->name,
                        'email' => $debt->user->email,
                    ],
                ];
            })->toArray(),
        ];
    }

    public function withResponse(Request $request, $response): void
    {
        $response->setData(array_merge([
            'status' => true,
            'message' => 'Debt retrieved successfully',
        ], $response->getData(true)));
    }
}
